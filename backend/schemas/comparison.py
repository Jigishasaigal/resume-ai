from pydantic import BaseModel


class ResumeComparisonResponse(BaseModel):

    resume1_score: float

    resume2_score: float

    winner: str

    common_skills: list[str]

    unique_resume1: list[str]

    unique_resume2: list[str]

    feedback: list[str]