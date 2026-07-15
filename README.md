# 🚀 ResumeAI - AI Resume Matcher

ResumeAI is an AI-powered Resume Analyzer and ATS Resume Matcher built using FastAPI, PostgreSQL, Docker, and JavaScript. It analyzes resumes against job descriptions, calculates ATS compatibility scores, identifies missing skills, manages multiple resume versions, and helps users optimize their resumes for different job roles.

---

## 🌐 Live Demo

### Frontend
https://resume-ai-frontend-jezz.onrender.com

### Backend API
https://resume-ai-backend-v7l8.onrender.com

### API Documentation
https://resume-ai-backend-v7l8.onrender.com/docs

### Docker Hub
https://hub.docker.com/r/jigisha77/ai-resume-matcher-backend

---

# Features

- User Authentication (JWT)
- Resume Upload (PDF)
- ATS Score Calculation
- Resume vs Job Description Analysis
- Skill Matching
- Required & Optional Missing Skills
- Resume Suggestions
- Resume Version Management
- Resume Comparison
- Application Tracker
- Resume Preview
- Report Generation
- Responsive UI

---

# Tech Stack

## Frontend

- HTML
- CSS
- JavaScript

## Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- PyMuPDF

## Machine Learning

- Scikit-learn

## Database

- PostgreSQL (Neon)

## Deployment

- Render
- Docker
- Docker Hub

---

# Project Structure

```
AI-Resume-Matcher
│
├── backend
│   ├── analysis
│   ├── config
│   ├── models
│   ├── routes
│   ├── schemas
│   ├── services
│   ├── utils
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend
│   ├── css
│   ├── js
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   └── ...
│
├── docker-compose.yml
└── README.md
```

---

# Architecture

```
Browser
    │
    ▼
Frontend (Render)
    │
    ▼
FastAPI Backend (Render)
    │
    ▼
Neon PostgreSQL
```

---

# Docker

## Build

```bash
docker build -t ai-resume-matcher-backend ./backend
```

## Run

```bash
docker run -p 8000:8000 ai-resume-matcher-backend
```

## Docker Compose

```bash
docker compose up --build
```

---

# Local Installation

## Clone

```bash
git clone https://github.com/Jigishasaigal/resume-ai.git

cd resume-ai
```

## Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

## Frontend

Open

```
frontend/index.html
```

using Live Server.

---

# API Endpoints

Authentication

- POST /auth/signup
- POST /auth/login
- GET /auth/me

Resume

- Upload Resume
- Compare Resume Versions
- Resume Report

Applications

- Create Application
- View Applications

---

## Optimization

- Reduced Docker image size from **8.67 GB** to **797 MB** by removing unused ML dependencies and adding a `.dockerignore` file.

# Future Improvements

- AI-powered resume rewriting
- LLM-based career recommendations
- LinkedIn profile analysis
- Resume templates
- Interview preparation assistant

---

# Author

**Jigisha Saigal**

GitHub:
https://github.com/Jigishasaigal

Docker Hub:
https://hub.docker.com/u/jigisha77