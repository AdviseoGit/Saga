@echo off
REM Railway deployment script för Saga (Windows) - Fixed version
REM Kör detta script för att deploya utan stora filer

echo 🚂 Preparing Saga for Railway deployment...

REM Kontrollera att vi är i rätt katalog
if not exist "package.json" (
    echo ❌ Fel: package.json not found. Kör från projekt-root.
    exit /b 1
)

REM Kontrollera Railway link
railway link --check >nul 2>&1
if errorlevel 1 (
    echo ❌ Railway projekt inte länkat. Kör: railway link 4cd88f77-6211-4015-8833-b15a515fcd42
    echo Eller kör: railway link och välj SAGA projektet
    pause
    exit /b 1
)

echo ✅ Railway projekt länkat!

REM Ta bort byggnads-kataloger (ignorera fel)
echo 🧹 Cleaning up build directories...
if exist .next rmdir /s /q .next 2>nul
if exist out rmdir /s /q out 2>nul
if exist build rmdir /s /q build 2>nul
if exist dist rmdir /s /q dist 2>nul

REM Ta bort development files
echo 📦 Removing development files...
if exist scripts\*.py del /q scripts\*.py 2>nul
if exist *.py del /q *.py 2>nul
if exist training_report_* del /q training_report_* 2>nul
if exist dev-server.log del /q dev-server.log 2>nul

REM Ta bort Supabase lokal config
echo 🗑️ Removing Supabase local files...
if exist supabase\.temp rmdir /s /q supabase\.temp 2>nul
if exist supabase\config.toml del /q supabase\config.toml 2>nul

REM Räkna filer (approximation)
echo 📊 Checking project size...
for /f %%i in ('dir /s /a-d ^| find "File(s)"') do echo Filer: %%i

REM Notera: node_modules lämnas kvar eftersom Railway behöver package.json för att bygga
echo ℹ️ Note: node_modules behålls - Railway bygger från package.json

REM Deploy till Railway
echo 🚀 Deploying to Railway...
railway up

if errorlevel 1 (
    echo ❌ Railway deployment misslyckades!
    echo 💡 Försök: railway up --detach
    echo 💡 Eller: deploya från GitHub istället
    pause
    exit /b 1
)

echo ✅ Deployment successful!
echo 🌐 Railway Dashboard: https://railway.com/project/4cd88f77-6211-4015-8833-b15a515fcd42
echo 🔧 Glöm inte att sätta environment variables i Railway dashboard!

pause