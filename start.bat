@echo off
echo ========================================
echo    Library Management System
echo ========================================
echo.
echo Starting the system...
echo.

REM Check if MongoDB is running (optional check)
echo Checking MongoDB connection...
echo.

REM Start the development server
echo Starting development server...
echo.
echo Server will be available at: http://localhost:3000
echo API Documentation: http://localhost:3000/api-docs
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause

