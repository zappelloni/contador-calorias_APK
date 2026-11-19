@echo off
cd /d "%~dp0"
echo Gerando o APK do Contador de Calorias na nuvem do Expo...
echo (na primeira vez ele pede o login da sua conta expo.dev)
if not exist node_modules call npm install
call npx eas-cli@latest login
call npx eas-cli@latest build -p android --profile apk
echo.
echo Pronto! Abra o link acima no celular (ou escaneie o QR) e toque em Instalar.
pause
