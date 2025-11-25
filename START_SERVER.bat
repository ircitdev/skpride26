@echo off
echo ================================================
echo   PRIDE Liquid Slider - Local Server
echo ================================================
echo.
echo Starting Python HTTP server on port 8000...
echo.
echo Open in browser: http://localhost:8000/index.html
echo OR: http://localhost:8000/liquid-slider-demo.html
echo.
echo Press Ctrl+C to stop server
echo ================================================
echo.

python -m http.server 8000

pause
