from datetime import datetime

from pydantic import BaseModel


class ResumeVersionCreate(BaseModel):

    file_name: str

    ats_score: int

    matched_skills: str

    missing_skills: str

    suggestions: str



class ResumeVersionResponse(BaseModel):

    id: int

    version_number: int

    version_name: str | None = None

    file_name: str

    pdf_path: str | None = None

    ats_score: int

    matched_skills: str

    missing_skills: str

    suggestions: str

    score_breakdown: str | None = None

    required_missing_skills: str | None = None

    optional_missing_skills: str | None = None

    created_at: datetime

    class Config:

        from_attributes = True