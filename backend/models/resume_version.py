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

    # Added: optional user-given label (e.g. "Google Application Draft")
    # shown instead of the generic "Version N" when present.
    version_name = Column(
        String,
        nullable=True
    )

    file_name = Column(
        String,
        nullable=False
    )

    # Deprecated: previously the on-disk path to the uploaded PDF.
    # New uploads store the file directly in pdf_data instead, since
    # local disk storage doesn't survive restarts on most hosting
    # platforms. Left here (nullable) so old rows created before this
    # change still have a value if you ever need it.
    pdf_path = Column(
        String,
        nullable=True
    )

    # Added: the actual PDF file bytes, stored directly in Postgres.
    # This replaces on-disk storage so uploaded resumes survive
    # redeploys/restarts on hosting with an ephemeral filesystem.
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

    # Added: stores the per-category score breakdown (skills,
    # experience, education, projects, keyword_density) as a JSON
    # string. ats.py already computes this on every upload — it was
    # just never being saved, so report.html could never show it.
    score_breakdown = Column(
        Text,
        nullable=True
    )

    # Added: comma-separated missing skills split by whether the JD
    # listed them under a "Required" vs "Preferred/Optional" section.
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