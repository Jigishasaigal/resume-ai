from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class Application(Base):

    __tablename__ = "applications"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    company_name = Column(
        String,
        nullable=False
    )

    job_role = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        nullable=False,
        default="Applied"
    )

    job_link = Column(
        String,
        nullable=True
    )

    notes = Column(
        Text,
        nullable=True
    )

    applied_date = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="applications"
    )