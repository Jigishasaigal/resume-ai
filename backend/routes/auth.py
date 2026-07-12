from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm
)

from sqlalchemy.orm import Session

from database import get_db

from models.user import User

from schemas.auth import (
    UserRegister,
    UserResponse,
    Token
)

from utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


# =====================================
# Get Current User
# =====================================

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    payload = decode_access_token(token)

    if payload is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token."
        )

    email = payload.get("sub")

    if email is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token."
        )

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found."
        )

    return user


# =====================================
# Signup
# =====================================

@router.post(
    "/signup",
    status_code=status.HTTP_201_CREATED
)
def signup(

    user: UserRegister,

    db: Session = Depends(get_db)

):

    existing_user = (

        db.query(User)

        .filter(
            User.email == user.email
        )

        .first()

    )

    if existing_user:

        raise HTTPException(

            status_code=400,

            detail="Email already registered."

        )

    new_user = User(

        name=user.name,

        email=user.email,

        password_hash=hash_password(
            user.password
        ),

        college=user.college,

        branch=user.branch,

        year=user.year

    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {

        "message":
        "User registered successfully."

    }


# =====================================
# Login
# =====================================

@router.post(
    "/login",
    response_model=Token
)
def login(

    form_data: OAuth2PasswordRequestForm = Depends(),

    db: Session = Depends(get_db)

):

    user = (

        db.query(User)

        .filter(
            User.email == form_data.username
        )

        .first()

    )

    if user is None:

        raise HTTPException(

            status_code=401,

            detail="Invalid email or password."

        )

    if not verify_password(

        form_data.password,

        user.password_hash

    ):

        raise HTTPException(

            status_code=401,

            detail="Invalid email or password."

        )

    access_token = create_access_token(

        {

            "sub": user.email,

            "user_id": user.id

        }

    )

    return {

        "access_token": access_token,

        "token_type": "bearer"

    }


# =====================================
# Current User
# =====================================

@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(

    current_user: User = Depends(
        get_current_user
    )

):

    return current_user