@echo off
title Hastina Motor Parts - Web Server (localhost:3000)
color 0A
cls
echo ===================================================================
echo             HASTINA MOTOR PARTS WEB APPLICATION
echo ===================================================================
echo.
echo [IMPORTANT] IS CMD WINDOW KO BAND MAT KAREIN!
echo [IMPORTANT] KEEP THIS WINDOW OPEN WHILE USING THE WEBSITE!
echo.
cd /d "%~dp0"
echo Working Directory: %CD%
echo.

echo [1/2] Opening browser at http://localhost:3000 in 6 seconds...
start "" cmd /c "timeout /t 6 /nobreak >nul & start http://localhost:3000"

echo [2/2] Starting Next.js Server on http://localhost:3000 ...
echo -------------------------------------------------------------------
echo Pehli baar compile hone mein 10 second lagte hain.
echo Agar browser pehle khul jaye, toh 10 second baad Refresh (F5) karein.
echo -------------------------------------------------------------------
echo.

call npm.cmd run dev:web

echo.
echo -------------------------------------------------------------------
echo Server band ho gaya hai.
pause
