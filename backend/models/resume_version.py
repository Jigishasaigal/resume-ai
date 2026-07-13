from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    DateTime,
    Text,
    LargeBinary
)

from sqlalchemy.orm import relationship

from sqlalchemy.sql import func

from database import Base


class ResumeVersion(Base):

    __tablename__ = "resume_versions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    group_id = Column(
        Integer,
        ForeignKey(
            "resume_groups.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    version_number = Column(
        Integer,
        nullable=False
    )

    version_name = Column(
        String,
        nullable=True
    )

    file_name = Column(
        String,
        nullable=False
    )

    pdf_path = Column(
        String,
        nullable=True
    )

    pdf_data = Column(
        LargeBinary,
        nullable=True
    )

    ats_score = Column(
        Integer,
        nullable=False
    )

    matched_skills = Column(
        Text,
        nullable=True
    )

    missing_skills = Column(
        Text,
        nullable=True
    )

    suggestions = Column(
        Text,
        nullable=True
    )

    score_breakdown = Column(
        Text,
        nullable=True
    )

    required_missing_skills = Column(
        Text,
        nullable=True
    )

    optional_missing_skills = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    group = relationship(
        "ResumeGroup",
        back_populates="versions"
    )