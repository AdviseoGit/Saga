#!/usr/bin/env node
/**
 * Migration Script: Supabase Edge Functions → Railway Next.js API Routes
 *
 * Denna script hjälper till att migrera från Supabase hosting till Railway
 * och validerar att alla API routes fungerar korrekt.
 */

// Load environment variables from .env.local
const fs = require('fs');
const path = require('path');

// Simple .env loader (no external dependencies)
function loadEnvFile(filePath) {
  try {
    const envFile = fs.readFileSync(filePath, 'utf8');
    const envVars = {};

    envFile.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          envVars[key.trim()] = value;
        }
      }
    });

    return envVars;
  } catch (error) {
    return {};
  }
}

// Load .env.local and merge with process.env
const envLocalPath = path.join(process.cwd(), '.env.local');
const envVars = loadEnvFile(envLocalPath);

// Merge with existing process.env (process.env takes precedence)
Object.keys(envVars).forEach(key => {
  if (!process.env[key]) {
    process.env[key] = envVars[key];
  }
});

console.log(`📁 Loaded ${Object.keys(envVars).length} variables from .env.local`);
const { execSync, spawn } = require('child_process');

const chalk = require('chalk'); // npm install chalk (optional)

const API_ROUTES = [
  '/api/health',
  '/api/analyze-quote',
  '/api/verify-company',
  '/api/ml-predict',
  '/api/ml-feedback'
];

const REQUIRED_ENV_VARS = [
  'ANTHROPIC_API_KEY',
  'ROARING_CLIENT_ID',
  'ROARING_CLIENT_SECRET'
];

const OPTIONAL_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // cyan
    success: '\x1b[32m', // green
    warning: '\x1b[33m', // yellow
    error: '\x1b[31m',   // red
    reset: '\x1b[0m'     // reset
  };

  console.log(`${colors[type]}${message}${colors.reset}`);
}

function checkEnvironmentVariables() {
  log('🔍 Checking environment variables...', 'info');

  const missing = [];
  const optional_missing = [];

  REQUIRED_ENV_VARS.forEach(envVar => {
    if (!process.env[envVar]) {
      missing.push(envVar);
    } else {
      log(`  ✅ ${envVar}: configured`, 'success');
    }
  });

  OPTIONAL_ENV_VARS.forEach(envVar => {
    if (!process.env[envVar]) {
      optional_missing.push(envVar);
    } else {
      log(`  ✅ ${envVar}: configured`, 'success');
    }
  });

  if (missing.length > 0) {
    log(`❌ Missing required environment variables:`, 'error');
    missing.forEach(env => log(`   - ${env}`, 'error'));
    log('\nCreate a .env.local file with these variables before continuing.', 'warning');
    return false;
  }

  if (optional_missing.length > 0) {
    log(`⚠️  Optional environment variables (for ML functionality):`, 'warning');
    optional_missing.forEach(env => log(`   - ${env}`, 'warning'));
  }

  return true;
}

function validateFileStructure() {
  log('📁 Validating project structure...', 'info');

  const requiredFiles = [
    'app/api/health/route.ts',
    'app/api/analyze-quote/route.ts',
    'app/api/verify-company/route.ts',
    'app/api/ml-predict/route.ts',
    'app/api/ml-feedback/route.ts',
    'lib/api-client.ts',
    'railway.toml',
    'RAILWAY_DEPLOYMENT.md'
  ];

  const missing = [];

  requiredFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      log(`  ✅ ${file}`, 'success');
    } else {
      missing.push(file);
      log(`  ❌ ${file}`, 'error');
    }
  });

  if (missing.length > 0) {
    log('\n❌ Missing required files for Railway migration.', 'error');
    return false;
  }

  log('✅ All required files present!', 'success');
  return true;
}

function buildProject() {
  log('🔨 Building Next.js project...', 'info');

  try {
    execSync('npm run build', { stdio: 'inherit' });
    log('✅ Build successful!', 'success');
    return true;
  } catch (error) {
    log('❌ Build failed!', 'error');
    log(`Error: ${error.message}`, 'error');
    return false;
  }
}

function startDevServer() {
  log('🚀 Starting development server for testing...', 'info');

  return new Promise((resolve) => {
    // Start dev server as detached process
    const server = spawn('npm', ['run', 'dev'], {
      detached: true,
      stdio: 'ignore'
    });

    const pid = server.pid;
    log(`Server started with PID: ${pid}`, 'info');

    // Vänta på att servern startar
    setTimeout(() => {
      resolve(pid);
    }, 8000); // Lite längre för att säkerställa att servern startar
  });
}

async function testAPIRoutes(baseUrl = 'http://localhost:3000') {
  log(`🧪 Testing API routes at ${baseUrl}...`, 'info');

  const results = {};

  for (const route of API_ROUTES) {
    try {
      const response = await fetch(`${baseUrl}${route}`, {
        method: route === '/api/health' ? 'GET' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: route === '/api/health' ? undefined : JSON.stringify({
          // Test data för olika endpoints
          ...(route === '/api/analyze-quote' && {
            pdfText: 'Test offert från TestAB 123456-7890. Badrumsrenovering. Totalt: 100 000 kr'
          }),
          ...(route === '/api/verify-company' && {
            org_nr: '5560360793'
          }),
          ...(route === '/api/ml-predict' && {
            features: {
              category: 'badrum',
              region: 'stockholm',
              totalAmount: 100000,
              estimatedArea: 20
            }
          }),
          ...(route === '/api/ml-feedback' && {
            features: { category: 'test' },
            originalPrediction: 100000,
            userFeedback: 'fair'
          })
        })
      });

      results[route] = {
        status: response.status,
        ok: response.ok
      };

      if (response.ok) {
        log(`  ✅ ${route} (${response.status})`, 'success');
      } else {
        log(`  ⚠️  ${route} (${response.status})`, 'warning');
      }

    } catch (error) {
      results[route] = {
        status: 'error',
        error: error.message,
        ok: false
      };
      log(`  ❌ ${route} (${error.message})`, 'error');
    }
  }

  return results;
}

function generateRailwayCommands() {
  log('\n🚂 Railway deployment commands:', 'info');
  log('1. Install Railway CLI:', 'info');
  log('   npm install -g @railway/cli', 'info');
  log('2. Login to Railway:', 'info');
  log('   railway login', 'info');
  log('3. Create new project:', 'info');
  log('   railway new', 'info');
  log('4. Add environment variables:', 'info');
  REQUIRED_ENV_VARS.forEach(env => {
    log(`   railway add ${env}`, 'info');
  });
  log('5. Deploy:', 'info');
  log('   railway up', 'info');
  log('6. View logs:', 'info');
  log('   railway logs', 'info');
}

function generateSummaryReport(results) {
  log('\n📊 Migration Summary:', 'info');

  const successful = Object.values(results).filter(r => r.ok).length;
  const total = Object.keys(results).length;

  log(`✅ API Routes working: ${successful}/${total}`, successful === total ? 'success' : 'warning');

  if (successful === total) {
    log('🎉 All API routes are working! Ready for Railway deployment.', 'success');
    log('\nNext steps:', 'info');
    log('1. Commit these changes to git', 'info');
    log('2. Push to GitHub', 'info');
    log('3. Deploy to Railway (see commands above)', 'info');
    log('4. Configure environment variables in Railway dashboard', 'info');
    log('5. Test production deployment', 'info');
  } else {
    log('⚠️  Some API routes have issues. Check the errors above.', 'warning');
  }
}

// Main migration script
async function main() {
  log('🚀 Starting Saga → Railway Migration', 'info');
  log('═══════════════════════════════════════', 'info');

  // Step 1: Check environment
  if (!checkEnvironmentVariables()) {
    process.exit(1);
  }

  // Step 2: Validate file structure
  if (!validateFileStructure()) {
    process.exit(1);
  }

  // Step 3: Build project
  if (!buildProject()) {
    process.exit(1);
  }

  // Step 4: Test API routes locally
  log('\n⏳ Starting development server for testing...', 'info');
  const pid = await startDevServer();

  try {
    const results = await testAPIRoutes();

    // Stop dev server (Windows compatible)
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${pid} /f`, { stdio: 'ignore' });
      } else {
        execSync(`kill ${pid}`, { stdio: 'ignore' });
      }
      log('Development server stopped', 'info');
    } catch (e) {
      log('Note: Server may still be running', 'warning');
    }

    // Generate summary
    generateSummaryReport(results);
    generateRailwayCommands();

  } catch (error) {
    log(`❌ Testing failed: ${error.message}`, 'error');

    // Clean up server process
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${pid} /f`, { stdio: 'ignore' });
      } else {
        execSync(`kill ${pid}`, { stdio: 'ignore' });
      }
    } catch (e) {
      // Ignore cleanup errors
    }

    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  checkEnvironmentVariables,
  validateFileStructure,
  buildProject,
  testAPIRoutes,
  generateSummaryReport
};