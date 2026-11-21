# ResumeMatch: Resume and Job Application Management System

ResumeMatch is a web-based Resume Analysis and Job Application Management System built using FastAPI, PostgreSQL, Docker, and JavaScript. It helps users evaluate resumes against job descriptions, calculate ATS compatibility scores, identify missing skills, generate improvement suggestions, manage multiple resume versions, compare resumes, and track job applications.

The application uses rule-based evaluation techniques, predefined skill aliases, regular expressions, and weighted scoring to analyze resume compatibility.

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

## Features

- User Authentication using JWT
- Resume Upload (PDF)
- ATS Compatibility Score Calculation
- Resume and Job Description Analysis
- Skill Extraction and Matching
- Required and Optional Missing Skills Identification
- Rule-Based Resume Improvement Suggestions
- Resume Version Management
- Resume Comparison
- Job Application Tracking
- Resume Preview and Download
- Report Generation
- Responsive User Interface

---

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Python
- FastAPI
- SQLAlchemy
- PyMuPDF
- JWT Authentication
- Passlib / bcrypt

### Resume Analysis
- Rule-Based ATS Scoring
- Regular Expressions
- Predefined Skill Dictionary and Aliases
- Weighted Scoring Mechanism
- Rule-Based Suggestions

### Database
- PostgreSQL

### Deployment
- Render
- Docker
- Docker Hub

---

## Project Structure

```text
ResumeMatch
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

## Architecture

```text
Browser
   │
   ▼
Frontend (Render)
   │
   ▼
FastAPI Backend (Render)
   │
   ▼
PostgreSQL Database
```

---

## Docker

### Build

```bash
docker build -t ai-resume-matcher-backend ./backend
```

### Run

```bash
docker run -p 8000:8000 ai-resume-matcher-backend
```

### Docker Compose

```bash
docker compose up --build
```

---

## Local Installation

### Clone Repository

```bash
git clone https://github.com/Jigishasaigal/resume-ai.git

cd resume-ai
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

### Frontend Setup

Open:

```text
frontend/index.html
```

using Live Server.

---

## API Endpoints

### Authentication
- POST `/auth/signup`
- POST `/auth/login`
- GET `/auth/me`

### Resume Management
- Upload Resume
- Manage Resume Groups
- Manage Resume Versions
- Resume Comparison
- Resume Report
- Resume Download

### Applications
- Create Application
- View Applications
- Update Application
- Delete Application

---

## Docker Optimization

- Reduced Docker image size from **8.67 GB to 797 MB**.
- Removed unused machine learning dependencies.
- Introduced a `.dockerignore` file to exclude unnecessary files from the Docker build context.
- Improved deployment efficiency by reducing the container image size.

---

## Future Improvements

- AI/LLM-based Resume Rewriting and Recommendations
- Semantic Skill Matching
- OCR Support for Scanned Resumes
- LinkedIn Profile Analysis
- Advanced Resume Templates
- Interview Preparation Assistant
- Advanced Job Application Analytics

---

## Author

**Jigisha Saigal**

GitHub:  
https://github.com/Jigishasaigal

Docker Hub:  
https://hub.docker.com/u/jigisha77no
