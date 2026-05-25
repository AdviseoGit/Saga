@echo off
REM Railway deployment script för Saga (Windows)
REM Kör detta script för att deploya utan stora filer

echo 🚂 Preparing Saga for Railway deployment...

REM Kontrollera att vi är i rätt katalog
if not exist "package.json" (
    echo ❌ Fel: package.json not found. Kör från projekt-root.
    exit /b 1
)

REM Ta bort stora kataloger om de finns
echo 🧹 Cleaning up large directories...
if exist node_modules rmdir /s /q node_modules
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist build rmdir /s /q build
if exist dist rmdir /s /q dist

REM Ta bort Python-filer och scripts
echo 📦 Removing development files...
if exist scripts\*.py del scripts\*.py
if exist *.py del *.py
if exist training_report_* del training_report_*
if exist dev-server.log del dev-server.log

REM Ta bort Supabase lokal config (inte nödvändigt för Railway)
echo 🗑️ Removing Supabase local files...
if exist supabase\.temp rmdir /s /q supabase\.temp
if exist supabase\config.toml del supabase\config.toml

echo 📊 Project cleaned for deployment!

REM Deploy till Railway
echo 🚀 Deploying to Railway...
railway up

echo ✅ Deployment command sent! Check Railway dashboard för status.
echo 🌐 Railway Project: https://railway.com/project/4cd88f77-6211-4015-8833-b15a515fcd42