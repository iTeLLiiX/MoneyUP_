# MoneyUP - Complete Setup Script for Private Laptop
# This script sets up everything needed to continue MoneyUP development

param(
    [switch]$SkipJava,
    [switch]$SkipNode,
    [switch]$SkipAndroid,
    [switch]$BuildOnly
)

Write-Host "🚀 MoneyUP - Complete Development Setup" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host "Setting up your private laptop for MoneyUP development..." -ForegroundColor Cyan

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "⚠️  Some features require administrator privileges" -ForegroundColor Yellow
    Write-Host "For full setup, run: Start-Process PowerShell -Verb RunAs" -ForegroundColor Yellow
}

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Function to download and install Java 17
function Install-Java17 {
    Write-Host "📥 Installing Java 17..." -ForegroundColor Yellow
    
    if (Test-Command "java") {
        $javaVersion = java -version 2>&1 | Select-String "version"
        if ($javaVersion -match "17") {
            Write-Host "✅ Java 17 already installed: $javaVersion" -ForegroundColor Green
            return $true
        }
    }
    
    $tempDir = "$env:TEMP\java17-install"
    if (!(Test-Path $tempDir)) {
        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    }
    
    $downloadUrl = "https://aka.ms/download-jdk/microsoft-jdk-17.0.15-windows-x64.msi"
    $installerPath = "$tempDir\microsoft-jdk-17.msi"
    
    try {
        Write-Host "Downloading Java 17..." -ForegroundColor Cyan
        Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath -UseBasicParsing
        
        Write-Host "Installing Java 17..." -ForegroundColor Cyan
        $process = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$installerPath`" /quiet /norestart" -Wait -PassThru
        
        if ($process.ExitCode -eq 0) {
            Write-Host "✅ Java 17 installed successfully!" -ForegroundColor Green
            
            # Set environment variables
            $javaPath = Get-ChildItem "C:\Program Files\Microsoft\jdk*" -Directory | Sort-Object Name -Descending | Select-Object -First 1
            if ($javaPath) {
                $javaHome = $javaPath.FullName
                [Environment]::SetEnvironmentVariable("JAVA_HOME", $javaHome, "User")
                $env:JAVA_HOME = $javaHome
                $env:PATH = "$javaHome\bin;$env:PATH"
                Write-Host "✅ JAVA_HOME set to: $javaHome" -ForegroundColor Green
            }
            
            Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
            return $true
        }
        else {
            Write-Host "❌ Java installation failed" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ Java installation error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to install Node.js
function Install-NodeJS {
    Write-Host "📥 Installing Node.js..." -ForegroundColor Yellow
    
    if (Test-Command "node") {
        $nodeVersion = node --version
        Write-Host "✅ Node.js already installed: $nodeVersion" -ForegroundColor Green
        return $true
    }
    
    $downloadUrl = "https://nodejs.org/dist/v18.19.0/node-v18.19.0-x64.msi"
    $tempDir = "$env:TEMP\nodejs-install"
    if (!(Test-Path $tempDir)) {
        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    }
    
    $installerPath = "$tempDir\nodejs-installer.msi"
    
    try {
        Write-Host "Downloading Node.js..." -ForegroundColor Cyan
        Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath -UseBasicParsing
        
        Write-Host "Installing Node.js..." -ForegroundColor Cyan
        $process = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$installerPath`" /quiet /norestart" -Wait -PassThru
        
        if ($process.ExitCode -eq 0) {
            Write-Host "✅ Node.js installed successfully!" -ForegroundColor Green
            Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
            return $true
        }
        else {
            Write-Host "❌ Node.js installation failed" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ Node.js installation error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to setup Android development
function Setup-Android {
    Write-Host "📱 Setting up Android development..." -ForegroundColor Yellow
    
    if (Test-Command "adb") {
        Write-Host "✅ Android SDK already available" -ForegroundColor Green
        return $true
    }
    
    Write-Host "⚠️  Android SDK not found. Please install Android Studio:" -ForegroundColor Yellow
    Write-Host "1. Download Android Studio from: https://developer.android.com/studio" -ForegroundColor Cyan
    Write-Host "2. Install with default settings" -ForegroundColor Cyan
    Write-Host "3. Run this script again" -ForegroundColor Cyan
    
    # Open Android Studio download page
    Start-Process "https://developer.android.com/studio"
    return $false
}

# Function to setup MoneyUP project
function Setup-MoneyUPProject {
    Write-Host "📁 Setting up MoneyUP project..." -ForegroundColor Yellow
    
    # Check if we're in the right directory
    if (!(Test-Path "MoneyUP\package.json")) {
        Write-Host "❌ MoneyUP project not found in current directory" -ForegroundColor Red
        Write-Host "Please run this script from the MoneyUP_ directory" -ForegroundColor Yellow
        return $false
    }
    
    Write-Host "Installing MoneyUP dependencies..." -ForegroundColor Cyan
    Set-Location "MoneyUP"
    
    try {
        npm install
        Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
        
        # Install additional React Native dependencies
        Write-Host "Installing React Native dependencies..." -ForegroundColor Cyan
        npm install @react-native-async-storage/async-storage react-native-safe-area-context react-native-screens
        
        Write-Host "✅ React Native dependencies installed!" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Failed to install dependencies: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to build APK
function Build-APK {
    Write-Host "🔨 Building MoneyUP APK..." -ForegroundColor Yellow
    
    if (!(Test-Path "android\app\build.gradle")) {
        Write-Host "❌ Android project not found" -ForegroundColor Red
        return $false
    }
    
    try {
        Set-Location "android"
        Write-Host "Cleaning previous builds..." -ForegroundColor Cyan
        .\gradlew clean
        
        Write-Host "Building release APK..." -ForegroundColor Cyan
        .\gradlew assembleRelease
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ APK build successful!" -ForegroundColor Green
            Write-Host "📁 APK location: android\app\build\outputs\apk\release\app-release.apk" -ForegroundColor Cyan
            
            if (Test-Path "app\build\outputs\apk\release\app-release.apk") {
                $apkSize = (Get-Item "app\build\outputs\apk\release\app-release.apk").Length / 1MB
                Write-Host "📊 APK size: $([math]::Round($apkSize, 2)) MB" -ForegroundColor Cyan
            }
            
            Set-Location ".."
            return $true
        }
        else {
            Write-Host "❌ APK build failed!" -ForegroundColor Red
            Set-Location ".."
            return $false
        }
    }
    catch {
        Write-Host "❌ Build error: $($_.Exception.Message)" -ForegroundColor Red
        Set-Location ".."
        return $false
    }
}

# Main execution
Write-Host "🔍 Checking system requirements..." -ForegroundColor Yellow

$success = $true

# Install Java 17
if (-not $SkipJava -and -not $BuildOnly) {
    if (-not (Install-Java17)) {
        $success = $false
    }
}

# Install Node.js
if (-not $SkipNode -and -not $BuildOnly) {
    if (-not (Install-NodeJS)) {
        $success = $false
    }
}

# Setup Android
if (-not $SkipAndroid -and -not $BuildOnly) {
    if (-not (Setup-Android)) {
        $success = $false
    }
}

# Setup MoneyUP project
if (-not $BuildOnly) {
    if (-not (Setup-MoneyUPProject)) {
        $success = $false
    }
}

# Build APK
if ($success -or $BuildOnly) {
    if (Build-APK) {
        Write-Host ""
        Write-Host "🎉 MoneyUP setup completed successfully!" -ForegroundColor Green
        Write-Host "=======================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "🚀 Next steps for Google Play Store:" -ForegroundColor Cyan
        Write-Host "1. Test APK on device/emulator" -ForegroundColor White
        Write-Host "2. Create release keystore for signing" -ForegroundColor White
        Write-Host "3. Sign APK with release key" -ForegroundColor White
        Write-Host "4. Create Android App Bundle (AAB)" -ForegroundColor White
        Write-Host "5. Upload to Google Play Console" -ForegroundColor White
        Write-Host ""
        Write-Host "💡 Development commands:" -ForegroundColor Cyan
        Write-Host "  npx react-native run-android  # Run on device/emulator" -ForegroundColor White
        Write-Host "  npx react-native start        # Start Metro bundler" -ForegroundColor White
        Write-Host ""
    }
    else {
        Write-Host "❌ APK build failed!" -ForegroundColor Red
    }
}
else {
    Write-Host "❌ Setup incomplete. Please fix the errors above." -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 System Status:" -ForegroundColor Cyan
Write-Host "Java: $(if (Test-Command 'java') { java -version 2>&1 | Select-String 'version' } else { 'Not installed' })" -ForegroundColor White
Write-Host "Node: $(if (Test-Command 'node') { node --version } else { 'Not installed' })" -ForegroundColor White
Write-Host "Android: $(if (Test-Command 'adb') { 'Available' } else { 'Not available' })" -ForegroundColor White

Write-Host ""
Write-Host "🔄 To run setup again: .\setup-moneyup-laptop.ps1" -ForegroundColor Yellow
Write-Host "🔨 To build only: .\setup-moneyup-laptop.ps1 -BuildOnly" -ForegroundColor Yellow

pause

