$ErrorActionPreference = "Stop"

npm install @capacitor/core @capacitor/ios
npm install -D @capacitor/cli

if (-not (Test-Path "ios")) {
  npx cap add ios
}

npx cap sync ios

Write-Host "Proyecto iOS preparado." -ForegroundColor Green
Write-Host "Ahora copia los archivos de native/ios/HealthKit según native/ios/HealthKit/INSTALL.md" -ForegroundColor Yellow
Write-Host "Después abre Xcode con: npx cap open ios" -ForegroundColor Yellow
