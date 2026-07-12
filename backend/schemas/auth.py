from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    name: str
    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=64
    )

    college: str | None = None
    branch: str | None = None
    year: str | None = None


class Token(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):

    id: int
    name: str
    email: EmailStr
    college: str | None
    branch: str | None
    year: str | None

    class Config:
        from_attributes = True
