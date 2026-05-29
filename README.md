# VectorShift Pipeline Studio

A full-stack pipeline builder with drag-and-drop editing, validation, run history, and shareable links.

## Demo accounts
- demo@vectorshift.ai / vectorshift
- analyst@vectorshift.ai / pipelines

## Local development

### Backend
1. Copy backend/.env.example to backend/.env and update values.
2. From backend/: `pip install -r requirements.txt`
3. From backend/: `uvicorn main:app --reload`

### Frontend
1. Copy frontend/.env.example to frontend/.env.local
2. Run: `npm install` from frontend
3. Start UI: `npm start`

## Docker (optional)
- `docker compose up --build`

## Deployment
- Backend: Render (see render.yaml)
- Frontend: Vercel (see frontend/vercel.json)

## Features
- Auth with demo accounts
- Pipeline list, search, and editor
- Drag-and-drop node canvas
- Inline validation (DAG check)
- Run history (simulated)
- Shareable read-only links
- Tests + GitHub Actions CI
