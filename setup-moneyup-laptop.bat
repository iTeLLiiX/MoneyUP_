@echo off
echo 🚀 MoneyUP - Complete Development Setup
echo =======================================
echo Setting up your private laptop for MoneyUP development...

REM Check for administrator privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Running with administrator privileges
) else (
    echo ⚠️  Some features require administrator privileges
    echo For full setup, right-click and "Run as administrator"
)

echo.
echo 🔍 Checking system requirements...

REM Check Java
java -version >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Java is installed
    java -version
) else (
    echo ❌ Java not found - will install Java 17
    call :InstallJava
)

echo.
REM Check Node.js
node --version >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Node.js is installed
    node --version
) else (
    echo ❌ Node.js not found - will install Node.js
    call :InstallNode
)

echo.
REM Check Android SDK
adb version >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Android SDK is available
) else (
    echo ⚠️  Android SDK not found
    echo Please install Android Studio from: https://developer.android.com/studio
    start https://developer.android.com/studio
)

echo.
echo 📁 Setting up MoneyUP project...

REM Check if MoneyUP project exists
if not exist "MoneyUP\package.json" (
    echo ❌ MoneyUP project not found in current directory
    echo Please run this script from the MoneyUP_ directory
    pause
    exit /b 1
)

echo Installing MoneyUP dependencies...
cd MoneyUP
call npm install
if %errorLevel% == 0 (
    echo ✅ Dependencies installed successfully!
) else (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo Installing React Native dependencies...
call npm install @react-native-async-storage/async-storage react-native-safe-area-context react-native-screens
if %errorLevel% == 0 (
    echo ✅ React Native dependencies installed!
) else (
    echo ⚠️  Some dependencies failed to install
)

echo.
echo 🔨 Building MoneyUP APK...

if not exist "android\app\build.gradle" (
    echo ❌ Android project not found
    pause
    exit /b 1
)

cd android
echo Cleaning previous builds...
call gradlew clean

echo Building release APK...
call gradlew assembleRelease

if %errorLevel% == 0 (
    echo ✅ APK build successful!
    echo.
    echo 📁 APK location: android\app\build\outputs\apk\release\app-release.apk
    echo.
    if exist "app\build\outputs\apk\release\app-release.apk" (
        echo 📊 APK Details:
        dir "app\build\outputs\apk\release\app-release.apk"
    )
    echo.
    echo 🎉 MoneyUP setup completed successfully!
    echo =======================================
    echo.
    echo 🚀 Next steps for Google Play Store:
    echo 1. Test APK on device/emulator
    echo 2. Create release keystore for signing
    echo 3. Sign APK with release key
    echo 4. Create Android App Bundle (AAB)
    echo 5. Upload to Google Play Console
    echo.
    echo 💡 Development commands:
    echo   npx react-native run-android  # Run on device/emulator
    echo   npx react-native start        # Start Metro bundler
) else (
    echo ❌ APK build failed!
    echo Please check the error messages above.
)

cd ..
echo.
echo 📋 System Status:
java -version 2>nul && echo Java: Available || echo Java: Not available
node --version 2>nul && echo Node: Available || echo Node: Not available
adb version >nul 2>&1 && echo Android: Available || echo Android: Not available

echo.
echo 🔄 To run setup again: setup-moneyup-laptop.bat
echo.

pause
exit /b 0

:InstallJava
echo 📥 Installing Java 17...
if not exist "%TEMP%\java17-install" mkdir "%TEMP%\java17-install"

set "DOWNLOAD_URL=https://aka.ms/download-jdk/microsoft-jdk-17.0.15-windows-x64.msi"
set "INSTALLER_PATH=%TEMP%\java17-install\microsoft-jdk-17.msi"

echo Downloading Java 17...
powershell -Command "& {Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%INSTALLER_PATH%' -UseBasicParsing}"

if exist "%INSTALLER_PATH%" (
    echo Installing Java 17...
    msiexec /i "%INSTALLER_PATH%" /quiet /norestart
    if %errorLevel% == 0 (
        echo ✅ Java 17 installed successfully!
        
        REM Set JAVA_HOME
        for /d %%i in ("C:\Program Files\Microsoft\jdk*") do set "JAVA_HOME=%%i"
        if not defined JAVA_HOME (
            for /d %%i in ("C:\Program Files\Java\jdk*") do set "JAVA_HOME=%%i"
        )
        if defined JAVA_HOME (
            setx JAVA_HOME "%JAVA_HOME%" /M
            echo ✅ JAVA_HOME set to: %JAVA_HOME%
        )
    ) else (
        echo ❌ Java installation failed!
    )
    
    rmdir /s /q "%TEMP%\java17-install" 2>nul
) else (
    echo ❌ Java download failed!
)
goto :eof

:InstallNode
echo 📥 Installing Node.js...
if not exist "%TEMP%\nodejs-install" mkdir "%TEMP%\nodejs-install"

set "DOWNLOAD_URL=https://nodejs.org/dist/v18.19.0/node-v18.19.0-x64.msi"
set "INSTALLER_PATH=%TEMP%\nodejs-install\nodejs-installer.msi"

echo Downloading Node.js...
powershell -Command "& {Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%INSTALLER_PATH%' -UseBasicParsing}"

if exist "%INSTALLER_PATH%" (
    echo Installing Node.js...
    msiexec /i "%INSTALLER_PATH%" /quiet /norestart
    if %errorLevel% == 0 (
        echo ✅ Node.js installed successfully!
    ) else (
        echo ❌ Node.js installation failed!
    )
    
    rmdir /s /q "%TEMP%\nodejs-install" 2>nul
) else (
    echo ❌ Node.js download failed!
)
goto :eof

