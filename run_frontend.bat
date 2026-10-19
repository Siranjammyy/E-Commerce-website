@echo off
title VERO - React Vite Frontend
echo ========================================================
echo   Starting VERO React Vite Frontend (Port 5173)
echo ========================================================
cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo [INFO] Installing frontend dependencies...
    call npm install
)

echo Starting Vite development server...
npm run dev
pause
