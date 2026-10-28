@echo off
title Sistem Manajemen Rapat - Pemkab Bekasi
echo ========================================================
echo  Menjalankan Sistem Manajemen Rapat Pemkab Bekasi
echo ========================================================
echo.
echo 1. Menjalankan Backend API (Port 5000)...
start "Backend API Rapat" cmd /k "cd backend && npm run dev"

timeout /t 2 /nobreak >nul

echo 2. Menjalankan Frontend Web (Port 5173)...
start "Frontend Web Rapat" cmd /k "cd frontend && npm run dev"

echo.
echo Kedua server telah dijalankan di jendela terpisah:
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:5000
echo ========================================================
pause
