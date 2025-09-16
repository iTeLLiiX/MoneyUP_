@echo off
echo 🚀 MoneyUP - Java 17 Installation Script
echo =========================================

REM Check for administrator privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Running with administrator privileges
) else (
    echo ❌ This script requires administrator privileges!
    echo Please right-click and "Run as administrator"
    pause
    exit /b 1
)

REM Check if Java 17 is already installed
java -version >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Java is already installed
    java -version
    goto :verify
)

echo 📥 Downloading OpenJDK 17...

REM Create temp directory
if not exist "%TEMP%\java17-install" mkdir "%TEMP%\java17-install"

REM Download OpenJDK 17
set "DOWNLOAD_URL=https://aka.ms/download-jdk/microsoft-jdk-17.0.15-windows-x64.msi"
set "INSTALLER_PATH=%TEMP%\java17-install\microsoft-jdk-17.msi"

echo Downloading from: %DOWNLOAD_URL%
powershell -Command "& {Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%INSTALLER_PATH%' -UseBasicParsing}"

if not exist "%INSTALLER_PATH%" (
    echo ❌ Download failed!
    pause
    exit /b 1
)

echo ✅ Download completed!

echo 🔧 Installing Java 17...
msiexec /i "%INSTALLER_PATH%" /quiet /norestart

if %errorLevel% == 0 (
    echo ✅ Java 17 installed successfully!
) else (
    echo ❌ Installation failed!
    pause
    exit /b 1
)

echo 🔧 Setting up environment variables...

REM Find Java installation path
for /d %%i in ("C:\Program Files\Microsoft\jdk*") do set "JAVA_HOME=%%i"
if not defined JAVA_HOME (
    for /d %%i in ("C:\Program Files\Java\jdk*") do set "JAVA_HOME=%%i"
)

if not defined JAVA_HOME (
    echo ❌ Could not find Java installation path
    pause
    exit /b 1
)

echo Found Java installation at: %JAVA_HOME%

REM Set JAVA_HOME environment variable
setx JAVA_HOME "%JAVA_HOME%" /M

REM Add Java to PATH
setx PATH "%PATH%;%JAVA_HOME%\bin" /M

echo ✅ Environment variables set!

REM Clean up
rmdir /s /q "%TEMP%\java17-install" 2>nul

:verify
echo.
echo 🎉 Java 17 installation completed!
echo =================================
echo Please restart your terminal for changes to take effect.
echo.
echo To verify installation, run:
echo   java -version
echo   javac -version
echo.

echo 🧪 Testing Java installation...
set "PATH=%JAVA_HOME%\bin;%PATH%"
java -version
javac -version

echo.
echo 🚀 Ready to build MoneyUP for Android!
echo Next steps:
echo 1. Restart your terminal
echo 2. Run: cd MoneyUP ^&^& npx react-native run-android
echo.

pause

