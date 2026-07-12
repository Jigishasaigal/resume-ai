from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from database import get_db

from models.resume_group import ResumeGroup
from models.user import User

from routes.auth import get_current_user

from schemas.resume_group import (
    ResumeGroupCreate,
    ResumeGroupResponse
)

router = APIRouter(
    prefix="/resume/groups",
    tags=["Resume Groups"]
)


# =====================================
# Create Resume Group
# =====================================

@router.post(
    "",
    response_model=ResumeGroupResponse,
    status_code=status.HTTP_201_CREATED
)
def create_group(

    group: ResumeGroupCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    title = group.title.strip()

    if title == "":

        raise HTTPException(
            status_code=400,
            detail="Group title cannot be empty."
        )

    existing_group = (

        db.query(ResumeGroup)

        .filter(

            ResumeGroup.user_id == current_user.id,

            ResumeGroup.title == title

        )

        .first()

    )

    if existing_group:

        raise HTTPException(

            status_code=400,

            detail="Resume Group already exists."

        )

    new_group = ResumeGroup(

        title=title,

        user_id=current_user.id

    )

    db.add(new_group)

    db.commit()

    db.refresh(new_group)

    return new_group


# =====================================
# Get All Resume Groups
# =====================================

@router.get(
    "",
    response_model=list[ResumeGroupResponse]
)
def get_groups(

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    groups = (

        db.query(ResumeGroup)

        .filter(
            ResumeGroup.user_id == current_user.id
        )

        .order_by(
            ResumeGroup.title.asc()
        )

        .all()

    )

    return groups


# =====================================
# Get Single Resume Group
# =====================================

@router.get(
    "/{group_id}",
    response_model=ResumeGroupResponse
)
def get_group(

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

    return group


# =====================================
# Rename Resume Group
# =====================================

@router.put(
    "/{group_id}",
    response_model=ResumeGroupResponse
)
def update_group(

    group_id: int,

    group: ResumeGroupCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    resume_group = (

        db.query(ResumeGroup)

        .filter(

            ResumeGroup.id == group_id,

            ResumeGroup.user_id == current_user.id

        )

        .first()

    )

    if resume_group is None:

        raise HTTPException(

            status_code=404,

            detail="Resume Group not found."

        )

    resume_group.title = group.title.strip()

    db.commit()

    db.refresh(resume_group)

    return resume_group


# =====================================
# Delete Resume Group
# =====================================

@router.delete("/{group_id}")
def delete_group(

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

    db.delete(group)

    db.commit()

    return {

        "message": "Resume Group deleted successfully."

    }