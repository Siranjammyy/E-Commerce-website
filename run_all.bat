@echo off
title VERO MERN Launcher
echo ========================================================
echo   Launching VERO Full-Stack MERN E-Commerce Platform
echo ========================================================
echo Starting Node.js / Express Backend in separate window...
start "VERO Backend Server" cmd /k "%~dp0run_backend.bat"

timeout /t 3 /nobreak >nul

echo Starting React Vite Frontend in separate window...
start "VERO React Frontend" cmd /k "%~dp0run_frontend.bat"

echo.
echo ========================================================
echo   Both VERO services are booting!
echo   - Frontend Storefront: http://localhost:5173
echo   - Backend REST API:    http://localhost:5000/api
echo   - Health Check:        http://localhost:5000/
echo ========================================================
echo.
