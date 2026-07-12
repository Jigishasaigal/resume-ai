from pydantic import BaseModel


class ResumeGroupCreate(BaseModel):

    title: str


class ResumeGroupResponse(BaseModel):

    id: int

    title: str

    class Config:

        from_attributes = True