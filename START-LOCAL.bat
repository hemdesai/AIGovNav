@echo off
echo ========================================
echo AI Governance Navigator - Local Setup
echo ========================================
echo.
echo IMPORTANT: Before running, update .env file with your credentials from Replit!
echo.
pause

echo.
echo Installing dependencies...
call npm install

echo.
echo Setting up Prisma...
call npx prisma generate

echo.
echo Starting development servers...
echo Frontend will open at: http://localhost:5173
echo Backend API at: http://localhost:4000
echo.
start cmd /k "npm run dev:backend"
timeout /t 3 >nul
start cmd /k "npm run dev:frontend"

echo.
echo ========================================
echo Both servers are starting...
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:4000/api/health
echo ========================================
echo.