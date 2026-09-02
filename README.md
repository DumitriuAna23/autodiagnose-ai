# AutoDiagnose AI

AutoDiagnose AI is a full-stack automotive diagnostic assistant designed to help users understand vehicle symptoms, diagnostic trouble codes (DTCs), possible causes, recommended tests, and safety considerations.

## Project Goal

The goal of this project is to build a structured automotive diagnostic platform that combines:

- automotive diagnostic logic
- full-stack web development
- AI-assisted reasoning
- structured vehicle and DTC data
- bilingual support (English / Romanian)

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- Uvicorn

### Planned

- PostgreSQL
- AI integration
- authentication
- vehicle profiles
- diagnostic cases
- DTC knowledge base

## Current Status

Development foundation completed.

- Frontend running
- Backend running
- FastAPI health endpoint working
- Git repository initialized

## Development

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
cd backend
uvicorn app.main:app --reload
```

## Project Structure

```text
autodiagnose-ai/
├── frontend/
├── backend/
├── .gitignore
└── README.md
```