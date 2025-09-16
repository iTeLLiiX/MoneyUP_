# 🚀 MoneyUP - Laptop Setup Anleitung

## 📋 Was Sie auf Ihrem privaten Laptop benötigen:

### 1. **Dateien übertragen**
Kopieren Sie diese Dateien auf Ihren Laptop:
```
MoneyUP_/
├── MoneyUP/                    # React Native Projekt
├── setup-moneyup-laptop.bat    # Automatisches Setup-Skript
├── setup-moneyup-laptop.ps1    # PowerShell Version
└── LAPTOP-SETUP-ANLEITUNG.md   # Diese Anleitung
```

### 2. **Setup ausführen**

**Option A: Batch-Skript (einfach)**
```bash
# Rechtsklick → "Als Administrator ausführen"
setup-moneyup-laptop.bat
```

**Option B: PowerShell (erweitert)**
```powershell
# Als Administrator ausführen
.\setup-moneyup-laptop.ps1
```

### 3. **Was das Skript automatisch macht:**

✅ **Java 17 installieren** (für Android Build)  
✅ **Node.js installieren** (für React Native)  
✅ **MoneyUP Dependencies installieren**  
✅ **APK erstellen** (für Google Play Store)  
✅ **System-Status prüfen**  

## 🔧 Manuelle Installation (falls Skript nicht funktioniert):

### Java 17:
1. Download: https://aka.ms/download-jdk/microsoft-jdk-17.0.15-windows-x64.msi
2. Installieren
3. JAVA_HOME setzen: `C:\Program Files\Microsoft\jdk-17.0.15`

### Node.js:
1. Download: https://nodejs.org/dist/v18.19.0/node-v18.19.0-x64.msi
2. Installieren

### Android Studio:
1. Download: https://developer.android.com/studio
2. Installieren mit Standard-Einstellungen
3. Android SDK installieren

## 🚀 Nach dem Setup:

### APK testen:
```bash
cd MoneyUP
npx react-native run-android
```

### APK finden:
```
MoneyUP\android\app\build\outputs\apk\release\app-release.apk
```

## 📱 Für Google Play Store:

### 1. Release Keystore erstellen:
```bash
keytool -genkey -v -keystore moneyup-release-key.keystore -alias moneyup-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 2. APK signieren:
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore moneyup-release-key.keystore app-release-unsigned.apk moneyup-key-alias
```

### 3. AAB erstellen (für Play Store):
```bash
cd android
./gradlew bundleRelease
```

## 🎯 Nächste Schritte:

1. **APK auf Gerät testen**
2. **Google Play Developer Account erstellen** ($25 einmalig)
3. **App Listing vorbereiten** (Screenshots, Beschreibung)
4. **AAB hochladen** (nicht APK für Play Store)

## 🆘 Troubleshooting:

### Java-Fehler:
```bash
# JAVA_HOME prüfen
echo %JAVA_HOME%
java -version
```

### Node.js-Fehler:
```bash
# Node.js prüfen
node --version
npm --version
```

### Android-Fehler:
```bash
# Android SDK prüfen
adb version
```

### Build-Fehler:
```bash
# Clean Build
cd MoneyUP/android
./gradlew clean
./gradlew assembleRelease
```

## 📞 Support:

Bei Problemen:
1. **Skript-Logs prüfen**
2. **System-Status überprüfen**
3. **Fehlermeldungen notieren**
4. **Clean Build versuchen**

---

**🎉 Viel Erfolg mit MoneyUP im Google Play Store!**

