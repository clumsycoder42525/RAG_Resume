@echo off
start cmd /k "cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
start cmd /k "cd frontend && npm run dev"
echo Services are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
