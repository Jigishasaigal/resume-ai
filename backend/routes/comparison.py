from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException
)

from models.user import User

from routes.auth import get_current_user

from analysis.pdf_parser import extract_text_from_pdf
from analysis.comparator import compare_resumes
from analysis.comparison_suggestions import comparison_feedback

from schemas.comparison import ResumeComparisonResponse


router = APIRouter(
    prefix="/comparison",
    tags=["Resume Comparison"]
)

MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


@router.post(
    "",
    response_model=ResumeComparisonResponse
)
async def compare_resume(

    resume1: UploadFile = File(...),

    resume2: UploadFile = File(...),

    job_description: str = Form(...),

    current_user: User = Depends(get_current_user)

):

    if (
        not resume1.filename.lower().endswith(".pdf")
        or
        not resume2.filename.lower().endswith(".pdf")
    ):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    resume1_bytes = await resume1.read()
    resume2_bytes = await resume2.read()

    if (
        len(resume1_bytes) > MAX_RESUME_SIZE_BYTES
        or
        len(resume2_bytes) > MAX_RESUME_SIZE_BYTES
    ):
        raise HTTPException(
            status_code=400,
            detail="One of the resume files is too large (5 MB limit)."
        )

    try:

        resume1_text = extract_text_from_pdf(resume1_bytes)
        resume2_text = extract_text_from_pdf(resume2_bytes)

    except ValueError as err:

        raise HTTPException(
            status_code=400,
            detail=str(err)
        )

    result = compare_resumes(
        resume1_text,
        resume2_text,
        job_description
    )

    result["feedback"] = comparison_feedback(result)

    return result