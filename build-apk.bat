@echo off
echo 🚀 MoneyUP - Android APK Build Script
echo =====================================

REM Check if we're in the right directory
if not exist "android\app\build.gradle" (
    echo ❌ Please run this script from the MoneyUP project root directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo 📱 Building MoneyUP APK for Android Store...

REM Check Java version
echo 🔍 Checking Java version...
java -version
if %errorLevel% neq 0 (
    echo ❌ Java not found! Please install Java 17 first.
    echo Run: install-java17.bat
    pause
    exit /b 1
)

REM Clean previous builds
echo 🧹 Cleaning previous builds...
cd android
call gradlew clean

REM Build release APK
echo 🔨 Building release APK...
call gradlew assembleRelease

if %errorLevel% == 0 (
    echo ✅ APK build successful!
    echo.
    echo 📁 APK location: android\app\build\outputs\apk\release\app-release.apk
    echo.
    echo 🎯 Next steps for Google Play Store:
    echo 1. Create a release keystore for signing
    echo 2. Sign the APK with your release key
    echo 3. Create an Android App Bundle (AAB) for Play Store
    echo 4. Upload to Google Play Console
    echo.
    
    REM Check if APK exists
    if exist "app\build\outputs\apk\release\app-release.apk" (
        echo 📊 APK Details:
        dir "app\build\outputs\apk\release\app-release.apk"
        echo.
        echo 🚀 APK ready for testing!
    ) else (
        echo ⚠️  APK file not found in expected location
    )
) else (
    echo ❌ APK build failed!
    echo Please check the error messages above.
)

cd ..
echo.
echo 💡 Tips:
echo - Test the APK on a real device or emulator
echo - Use 'npx react-native run-android' for development
echo - Create signed APK for production release
echo.

pause

