from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from database import get_db

from models.application import Application
from models.user import User

from routes.auth import get_current_user

from schemas.application import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationResponse
)

router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)


# =====================================
# Create Application
# =====================================

@router.post(
    "",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED
)
def create_application(

    application: ApplicationCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    new_application = Application(

        company_name=application.company_name.strip(),

        job_role=application.job_role.strip(),

        status=application.status,

        job_link=application.job_link,

        notes=application.notes,

        user_id=current_user.id

    )

    db.add(new_application)

    db.commit()

    db.refresh(new_application)

    return new_application


# =====================================
# Get All Applications
# =====================================

@router.get(
    "",
    response_model=list[ApplicationResponse]
)
def get_applications(

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    return (

        db.query(Application)

        .filter(

            Application.user_id == current_user.id

        )

        .order_by(

            Application.applied_date.desc()

        )

        .all()

    )


# =====================================
# Get Single Application
# =====================================

@router.get(
    "/{application_id}",
    response_model=ApplicationResponse
)
def get_application(

    application_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    application = (

        db.query(Application)

        .filter(

            Application.id == application_id,

            Application.user_id == current_user.id

        )

        .first()

    )

    if application is None:

        raise HTTPException(

            status_code=404,

            detail="Application not found."

        )

    return application


# =====================================
# Update Application
# =====================================

@router.put(
    "/{application_id}",
    response_model=ApplicationResponse
)
def update_application(

    application_id: int,

    updated: ApplicationUpdate,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    application = (

        db.query(Application)

        .filter(

            Application.id == application_id,

            Application.user_id == current_user.id

        )

        .first()

    )

    if application is None:

        raise HTTPException(

            status_code=404,

            detail="Application not found."

        )

    application.company_name = updated.company_name.strip()

    application.job_role = updated.job_role.strip()

    application.status = updated.status

    application.job_link = updated.job_link

    application.notes = updated.notes

    db.commit()

    db.refresh(application)

    return application


# =====================================
# Delete Application
# =====================================

@router.delete("/{application_id}")
def delete_application(

    application_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    application = (

        db.query(Application)

        .filter(

            Application.id == application_id,

            Application.user_id == current_user.id

        )

        .first()

    )

    if application is None:

        raise HTTPException(

            status_code=404,

            detail="Application not found."

        )

    db.delete(application)

    db.commit()

    return {

        "message": "Application deleted successfully."

    }