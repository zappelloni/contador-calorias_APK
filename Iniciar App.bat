@echo off
cd /d "%~dp0"
echo Contador de Calorias - J.A.R.V.I.S
if not exist node_modules (
  echo Instalando pecas do app pela primeira vez, aguarde...
  call npm install
)
call npx expo start
pause
