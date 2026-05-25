#!/bin/bash
# Railway deployment script för Saga
# Kör detta script för att deploya utan stora filer

echo "🚂 Preparing Saga for Railway deployment..."

# Kontrollera att vi är i rätt katalog
if [ ! -f "package.json" ]; then
    echo "❌ Fel: package.json not found. Kör från projekt-root."
    exit 1
fi

# Ta bort stora kataloger om de finns
echo "🧹 Cleaning up large directories..."
rm -rf node_modules
rm -rf .next
rm -rf out
rm -rf build
rm -rf dist

# Ta bort Python-filer och scripts
echo "📦 Removing development files..."
rm -rf scripts/*.py
rm -rf *.py
rm -f training_report_*
rm -f dev-server.log

# Ta bort Supabase lokal config (inte nödvändigt för Railway)
echo "🗑️ Removing Supabase local files..."
rm -rf supabase/.temp/
rm -f supabase/config.toml

# Kontrollera storlek innan deployment
echo "📊 Checking deployment size..."
TOTAL_SIZE=$(du -sh . 2>/dev/null | cut -f1 || echo "Unknown")
echo "Total project size: $TOTAL_SIZE"

# Deploy till Railway
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Deployment command sent! Check Railway dashboard för status."
echo "🌐 Railway Project: https://railway.com/project/4cd88f77-6211-4015-8833-b15a515fcd42"