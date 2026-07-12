from datetime import datetime

from pydantic import BaseModel, HttpUrl


# =====================================
# Create
# =====================================

class ApplicationCreate(BaseModel):

    company_name: str

    job_role: str

    status: str = "Applied"

    job_link: str | None = None

    notes: str | None = None


# =====================================
# Update
# =====================================

class ApplicationUpdate(BaseModel):

    company_name: str

    job_role: str

    status: str

    job_link: str | None = None

    notes: str | None = None


# =====================================
# Response
# =====================================

class ApplicationResponse(BaseModel):

    id: int

    company_name: str

    job_role: str

    status: str

    job_link: str | None

    notes: str | None

    applied_date: datetime

    class Config:

        from_attributes = True