@echo off
title VERO - Node.js Express Backend
echo ========================================================
echo   Starting VERO MERN Backend Server (Port 5000)
echo ========================================================
cd /d "%~dp0backend"

if not exist "node_modules" (
    echo [INFO] Installing backend dependencies...
    call npm install
)

echo Starting Express server with MongoDB / In-Memory auto-fallback...
npm run dev
pause
