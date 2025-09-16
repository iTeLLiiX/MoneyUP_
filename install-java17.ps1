# MoneyUP - Java 17 Automatic Installation Script
# This script downloads and installs OpenJDK 17 for React Native development

Write-Host "🚀 MoneyUP - Java 17 Installation Script" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script requires administrator privileges!" -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    pause
    exit 1
}

# Check if Java 17 is already installed
$javaVersion = java -version 2>&1 | Select-String "version"
if ($javaVersion -match "17") {
    Write-Host "✅ Java 17 is already installed!" -ForegroundColor Green
    Write-Host "Current version: $javaVersion" -ForegroundColor Cyan
    exit 0
}

Write-Host "📥 Downloading OpenJDK 17..." -ForegroundColor Yellow

# Create temp directory
$tempDir = "$env:TEMP\java17-install"
if (!(Test-Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
}

# Download OpenJDK 17 (Microsoft Build)
$downloadUrl = "https://aka.ms/download-jdk/microsoft-jdk-17.0.15-windows-x64.msi"
$installerPath = "$tempDir\microsoft-jdk-17.msi"

try {
    Write-Host "Downloading from: $downloadUrl" -ForegroundColor Cyan
    Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "✅ Download completed!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Download failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Installing Java 17..." -ForegroundColor Yellow

# Install Java 17 silently
try {
    $process = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$installerPath`" /quiet /norestart" -Wait -PassThru
    
    if ($process.ExitCode -eq 0) {
        Write-Host "✅ Java 17 installed successfully!" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Installation failed with exit code: $($process.ExitCode)" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "❌ Installation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Setting up environment variables..." -ForegroundColor Yellow

# Find Java installation path
$javaPath = Get-ChildItem "C:\Program Files\Microsoft\jdk*" -Directory | Sort-Object Name -Descending | Select-Object -First 1
if (!$javaPath) {
    $javaPath = Get-ChildItem "C:\Program Files\Java\jdk*" -Directory | Sort-Object Name -Descending | Select-Object -First 1
}

if ($javaPath) {
    $javaHome = $javaPath.FullName
    Write-Host "Found Java installation at: $javaHome" -ForegroundColor Cyan
    
    # Set JAVA_HOME environment variable
    [Environment]::SetEnvironmentVariable("JAVA_HOME", $javaHome, "Machine")
    Write-Host "✅ JAVA_HOME set to: $javaHome" -ForegroundColor Green
    
    # Add Java to PATH
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
    $javaBinPath = "$javaHome\bin"
    
    if ($currentPath -notlike "*$javaBinPath*") {
        $newPath = "$currentPath;$javaBinPath"
        [Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
        Write-Host "✅ Java added to PATH" -ForegroundColor Green
    }
    else {
        Write-Host "✅ Java already in PATH" -ForegroundColor Green
    }
}
else {
    Write-Host "❌ Could not find Java installation path" -ForegroundColor Red
    exit 1
}

# Clean up
Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "🎉 Java 17 installation completed!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host "Please restart your terminal/IDE for changes to take effect." -ForegroundColor Yellow
Write-Host ""
Write-Host "To verify installation, run:" -ForegroundColor Cyan
Write-Host "  java -version" -ForegroundColor White
Write-Host "  javac -version" -ForegroundColor White
Write-Host ""

# Test Java installation
Write-Host "🧪 Testing Java installation..." -ForegroundColor Yellow
try {
    $env:JAVA_HOME = $javaHome
    $env:PATH = "$javaHome\bin;$env:PATH"
    
    $javaVersion = & java -version 2>&1 | Select-String "version"
    Write-Host "✅ Java version: $javaVersion" -ForegroundColor Green
    
    $javacVersion = & javac -version 2>&1
    Write-Host "✅ Java compiler: $javacVersion" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Java test failed. Please restart your terminal." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Ready to build MoneyUP for Android!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart your terminal" -ForegroundColor White
Write-Host "2. Run: cd MoneyUP && npx react-native run-android" -ForegroundColor White
Write-Host ""

pause

