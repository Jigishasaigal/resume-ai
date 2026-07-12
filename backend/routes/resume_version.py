import json

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from database import get_db

from models.resume_group import ResumeGroup
from models.resume_version import ResumeVersion
from models.user import User

from routes.auth import get_current_user

from analysis.pdf_parser import extract_text_from_pdf
from analysis.ats import calculate_ats_score
from analysis.suggestions import generate_suggestions

from schemas.resume_version import (
    ResumeVersionResponse
)

router = APIRouter(
    prefix="/resume",
    tags=["Resume Versions"]
)

# File size limit for uploaded resumes — resumes are small; this just
# guards against someone uploading something absurd, since the file
# now lives directly in the database.
MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


@router.post(
    "/groups/{group_id}/versions",
    response_model=ResumeVersionResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_version(

    group_id: int,

    resume: UploadFile = File(...),

    job_description: str = Form(...),

    version_name: str = Form(None),

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    if not resume.filename.lower().endswith(".pdf"):

        raise HTTPException(

            status_code=400,

            detail="Only PDF files are allowed."

        )

    group = (

        db.query(ResumeGroup)

        .filter(

            ResumeGroup.id == group_id,

            ResumeGroup.user_id == current_user.id

        )

        .first()

    )

    if group is None:

        raise HTTPException(

            status_code=404,

            detail="Resume Group not found."

        )

    pdf_bytes = await resume.read()

    if len(pdf_bytes) > MAX_RESUME_SIZE_BYTES:

        raise HTTPException(

            status_code=400,

            detail="Resume file is too large (5 MB limit)."

        )

    try:

        resume_text = extract_text_from_pdf(
            pdf_bytes
        )

        result = calculate_ats_score(

            resume_text,

            job_description

        )

        # Changed: pass the full result dict so suggestions.py can use
        # the score breakdown (experience/education/projects/keywords),
        # not just missing_skills.
        suggestions = generate_suggestions(

            result

        )

        latest_version = (

            db.query(ResumeVersion)

            .filter(

                ResumeVersion.group_id == group_id

            )

            .order_by(

                ResumeVersion.version_number.desc()

            )

            .first()

        )

        version_number = 1

        if latest_version:

            version_number = (

                latest_version.version_number + 1

            )

        new_version = ResumeVersion(

            group_id=group_id,

            version_number=version_number,

            version_name=(
                version_name.strip()
                if version_name and version_name.strip() != ""
                else None
            ),

            file_name=resume.filename,

            pdf_data=pdf_bytes,

            ats_score=result["ats_score"],

            matched_skills=",".join(
                result["matched_skills"]
            ),

            missing_skills=",".join(
                result["missing_skills"]
            ),

            suggestions="\n".join(
                suggestions
            ),

            score_breakdown=json.dumps(
                result["breakdown"]
            ),

            required_missing_skills=",".join(
                result["required_missing_skills"]
            ),

            optional_missing_skills=",".join(
                result["optional_missing_skills"]
            )

        )

        db.add(new_version)

        db.commit()

        db.refresh(new_version)

        return new_version

    except HTTPException:

        raise

    except Exception as e:

        db.rollback()

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )

# =====================================
# Get All Versions
# =====================================

@router.get(
    "/groups/{group_id}/versions",
    response_model=list[ResumeVersionResponse]
)
def get_versions(

    group_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    group = (

        db.query(ResumeGroup)

        .filter(

            ResumeGroup.id == group_id,

            ResumeGroup.user_id == current_user.id

        )

        .first()

    )

    if group is None:

        raise HTTPException(

            status_code=404,

            detail="Resume Group not found."

        )

    return (

        db.query(ResumeVersion)

        .filter(

            ResumeVersion.group_id == group_id

        )

        .order_by(

            ResumeVersion.version_number.desc()

        )

        .all()

    )


# =====================================
# Get One Version
# =====================================

@router.get(
    "/versions/{version_id}",
    response_model=ResumeVersionResponse
)
def get_version(

    version_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    version = (

        db.query(ResumeVersion)

        .join(ResumeGroup)

        .filter(

            ResumeVersion.id == version_id,

            ResumeGroup.user_id == current_user.id

        )

        .first()

    )

    if version is None:

        raise HTTPException(

            status_code=404,

            detail="Resume Version not found."

        )

    return version


# =====================================
# Resume Report
# =====================================

@router.get(
    "/versions/{version_id}/report"
)
def get_report(

    version_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    version = (

        db.query(ResumeVersion)

        .join(ResumeGroup)

        .filter(

            ResumeVersion.id == version_id,

            ResumeGroup.user_id == current_user.id

        )

        .first()

    )

    if version is None:

        raise HTTPException(

            status_code=404,

            detail="Resume Version not found."

        )

    return {

        "version": version.version_number,

        "file_name": version.file_name,

        "ats_score": version.ats_score,

        "matched_skills":

            version.matched_skills.split(",")

            if version.matched_skills else [],

        "missing_skills":

            version.missing_skills.split(",")

            if version.missing_skills else [],

        "suggestions":

            version.suggestions.split("\n")

            if version.suggestions else [],

        "breakdown":

            json.loads(version.score_breakdown)

            if version.score_breakdown else None,

        "required_missing_skills":

            version.required_missing_skills.split(",")

            if version.required_missing_skills else [],

        "optional_missing_skills":

            version.optional_missing_skills.split(",")

            if version.optional_missing_skills else [],

        "created_at": version.created_at

    }

# =====================================
# Download Resume PDF
# =====================================

from fastapi.responses import Response


@router.get("/versions/{version_id}/download")
def download_resume(

    version_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    version = (

        db.query(ResumeVersion)

        .join(ResumeGroup)

        .filter(

            ResumeVersion.id == version_id,

            ResumeGroup.user_id == current_user.id

        )

        .first()

    )

    if version is None:

        raise HTTPException(

            status_code=404,

            detail="Resume Version not found."

        )

    if not version.pdf_data:

        raise HTTPException(

            status_code=404,

            detail="Resume file not found."

        )

    return Response(

        content=version.pdf_data,

        media_type="application/pdf",

        headers={

            "Content-Disposition":

                f'inline; filename="{version.file_name}"'

        }

    )

# =====================================
# Delete Resume Version
# =====================================

@router.delete("/versions/{version_id}")
def delete_version(

    version_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    version = (

        db.query(ResumeVersion)

        .join(ResumeGroup)

        .filter(

            ResumeVersion.id == version_id,

            ResumeGroup.user_id == current_user.id

        )

        .first()

    )

    if version is None:

        raise HTTPException(

            status_code=404,

            detail="Resume Version not found."

        )

    db.delete(version)

    db.commit()

    return {

        "success": True,

        "message": "Resume Version deleted successfully."

    }