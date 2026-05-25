# 🚂 Railway Deployment Guide för Saga

Denna guide visar hur du deployar Saga till Railway och konfigurerar alla nödvändiga services.

## 🎯 **Förutsättningar**

- Railway-konto ([railway.app](https://railway.app))
- GitHub-repo med Saga-koden
- API-nycklar för Anthropic och Roaring.io

## 🚀 **Steg 1: Skapa Railway-projekt**

1. Gå till [railway.app](https://railway.app) och logga in
2. Klicka **"New Project"**
3. Välj **"Deploy from GitHub repo"**
4. Välj ditt Saga-repository
5. Railway kommer automatiskt upptäcka att det är ett Next.js-projekt

## ⚙️ **Steg 2: Konfigurera Environment Variables**

I Railway Dashboard → **Variables**, lägg till:

### **Nödvändiga API-nycklar:**
```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ROARING_CLIENT_ID=your_roaring_client_id
ROARING_CLIENT_SECRET=your_roaring_client_secret
```

### **Next.js konfiguration:**
```bash
NODE_ENV=production
NEXTAUTH_URL=https://your-app.railway.app
NEXTAUTH_SECRET=your_random_secret_here
```

### **Database (om du vill behålla Supabase för ML-data):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📦 **Steg 3: Deploy**

1. Railway startar automatisk deployment när du pushar till main branch
2. Vänta på att bygget slutförs (~2-5 minuter)
3. Railway ger dig en URL: `https://your-app.railway.app`

## ✅ **Steg 4: Verifiera Deployment**

1. **Health Check**: Gå till `https://your-app.railway.app/api/health`
   ```json
   {
     "status": "healthy",
     "services": {
       "api": "up",
       "anthropic": "configured",
       "roaring": "configured"
     }
   }
   ```

2. **Test API Routes**:
   ```bash
   # Test company verification
   curl -X POST https://your-app.railway.app/api/verify-company \
     -H "Content-Type: application/json" \
     -d '{"org_nr":"5560360793"}'

   # Test quote analysis (med test data)
   curl -X POST https://your-app.railway.app/api/analyze-quote \
     -H "Content-Type: application/json" \
     -d '{"pdfText":"Offert från TestAB. Badrumsrenovering 25 kvm. Totalt: 150 000 kr"}'
   ```

3. **Test Frontend**: Gå till `https://your-app.railway.app` och testa upload

## 🔧 **Steg 5: Custom Domain (valfritt)**

1. I Railway Dashboard → **Settings** → **Domains**
2. Klicka **"Custom Domain"**
3. Lägg till din domän (t.ex. `saga.yourdomain.com`)
4. Konfigurera DNS CNAME record:
   ```
   saga.yourdomain.com CNAME your-app.railway.app
   ```

## 📊 **Steg 6: Monitoring & Logs**

### **Logs:**
```bash
# Installera Railway CLI
npm install -g @railway/cli

# Logga in
railway login

# Koppla till projekt
railway link

# Visa live logs
railway logs
```

### **Metrics i Railway Dashboard:**
- CPU usage
- Memory usage
- Network traffic
- Request latency
- Error rates

## 🗄️ **Steg 7: Databas-setup (för ML)**

### **Option A: Fortsätt med Supabase**
- Behåll nuvarande Supabase-databas för ML träningsdata
- Endast API-routes flyttade till Railway

### **Option B: PostgreSQL på Railway**
```bash
# Lägg till PostgreSQL service i Railway
railway add postgresql

# Få databas-URL
railway variables

# Uppdatera connection string i koden
DATABASE_URL=postgresql://user:pass@host:port/db
```

### **Kör migrationer:**
```bash
# Om du använder Railway PostgreSQL
railway run psql $DATABASE_URL -f supabase/migrations/001_ml_training_schema.sql
```

## 🚀 **Steg 8: Auto-deployment**

Railway deployas automatiskt vid:
- Push till `main` branch
- Pull request merges
- Manual trigger

### **Konfigurera build kommando (valfritt):**
```toml
# railway.toml
[build]
builder = "NIXPACKS"
buildCommand = "npm run build"

[deploy]
startCommand = "npm start"
healthcheckPath = "/api/health"
```

## 🔒 **Steg 9: Säkerhet**

### **Environment variables:**
✅ **Aldrig commit:a nycklar** till git
✅ **Använd Railway Secrets** för känsliga värden
✅ **Separata environments** för staging/production

### **CORS & Rate Limiting:**
API routes har inbyggd rate limiting och CORS-stöd.

### **SSL/TLS:**
Railway ger automatisk SSL för alla deployments.

## 🆘 **Troubleshooting**

### **Deployment misslyckas:**
```bash
# Kontrollera build logs
railway logs --deployment

# Vanliga fix:
railway run npm install  # Dependencies
railway run npm run build # Build errors
```

### **API errors:**
```bash
# Kontrollera environment variables
railway variables

# Test lokalt först
npm run dev
```

### **Database connection issues:**
```bash
# Testa connection
railway run psql $DATABASE_URL -c "SELECT NOW();"
```

## 📈 **Performance Tips**

1. **Caching**: Railway har inbyggd CDN
2. **Build optimization**:
   ```json
   // next.config.ts
   {
     "experimental": {
       "optimizeCss": true,
       "optimizeServerReact": true
     }
   }
   ```
3. **Memory limits**: Sätt rätt memory för ditt plan

## 💰 **Pricing**

- **Starter**: $5/månad (512MB RAM, 1GB disk)
- **Developer**: $20/månad (8GB RAM, 100GB disk)
- **Team**: $99/månad (32GB RAM, 100GB disk)

För Saga rekommenderas **Developer** plan för production.

## 🎉 **Done!**

Din Saga-app är nu live på Railway! 🚂

**Next steps:**
1. Konfigurera custom domain
2. Sätt upp monitoring
3. Testa ML-feedback collection
4. Börja samla träningsdata

**Support:**
- Railway docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Saga issues: https://github.com/your-repo/saga/issues