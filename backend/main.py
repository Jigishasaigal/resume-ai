from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine

import models

from routes.auth import router as auth_router
from routes.resume_group import (
    router as resume_group_router
)
from routes.resume_version import (
    router as resume_version_router
)
from routes.application import (
    router as application_router
)
from routes.comparison import (
    router as comparison_router
)

# =====================================
# Create Database Tables
# =====================================

Base.metadata.create_all(bind=engine)

# =====================================
# FastAPI App
# =====================================

app = FastAPI(
    title="ResumeMatch: Resume and Job Application Management System",
    version="2.0.0"
)

# =====================================
# CORS
# =====================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:63342",
        "http://127.0.0.1:63342",
        "https://resume-ai-frontend-jezz.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# =====================================
# Routers
# =====================================

app.include_router(
    auth_router
)

app.include_router(
    resume_group_router
)

app.include_router(
    resume_version_router
)

app.include_router(
    application_router
)

app.include_router(
    comparison_router
)

# =====================================
# Home
# =====================================

@app.get("/")
def home():

    return {

        "message": "ResumeMatch Backend Running",

        "version": "2.0.0"

    }