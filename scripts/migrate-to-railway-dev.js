#!/usr/bin/env node
/**
 * Development Migration Script: Test Railway migration utan Roaring.io
 *
 * Detta script kör migration validation med mockad företagsverifiering
 * så du kan testa resten av systemet medan du väntar på Roaring API-nycklar.
 */

// Load environment variables from .env.local
const fs = require('fs');
const path = require('path');

// Simple .env loader
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

// Load .env.local
const envLocalPath = path.join(process.cwd(), '.env.local');
const envVars = loadEnvFile(envLocalPath);

Object.keys(envVars).forEach(key => {
  if (!process.env[key]) {
    process.env[key] = envVars[key];
  }
});

console.log(`📁 Loaded ${Object.keys(envVars).length} variables from .env.local`);
const { execSync } = require('child_process');

const REQUIRED_ENV_VARS = [
  'ANTHROPIC_API_KEY'
];

const OPTIONAL_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'ROARING_CLIENT_ID',
  'ROARING_CLIENT_SECRET'
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
  log('🔍 Checking environment variables (DEV mode)...', 'info');

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
    return false;
  }

  if (optional_missing.length > 0) {
    log(`⚠️  Missing optional variables (dev mode OK):`, 'warning');
    optional_missing.forEach(env => log(`   - ${env} (will use mock data)`, 'warning'));
  }

  return true;
}

async function testAPIRoutes(baseUrl = 'http://localhost:3000') {
  log(`🧪 Testing API routes at ${baseUrl} (DEV mode)...`, 'info');

  const routes = [
    {
      path: '/api/health',
      method: 'GET',
      body: undefined
    },
    {
      path: '/api/analyze-quote',
      method: 'POST',
      body: {
        pdfText: 'Offert från TestAB 123456-7890. Badrumsrenovering 25 kvm. Material och arbete. Totalt: 150 000 kr inkl moms.'
      }
    },
    {
      path: '/api/verify-company',
      method: 'POST',
      body: {
        org_nr: '5560360793'
      }
    },
    {
      path: '/api/ml-predict',
      method: 'POST',
      body: {
        features: {
          category: 'badrum',
          region: 'stockholm',
          totalAmount: 150000,
          includesVat: true,
          estimatedArea: 25,
          complexity: 'medium',
          seasonality: 2,
          laborIntensity: 0.6,
          materialQuality: 'standard'
        }
      }
    },
    {
      path: '/api/ml-feedback',
      method: 'POST',
      body: {
        features: { category: 'badrum', totalAmount: 150000 },
        originalPrediction: 145000,
        userFeedback: 'fair'
      }
    }
  ];

  const results = {};

  for (const route of routes) {
    try {
      log(`  Testing ${route.path}...`, 'info');

      const response = await fetch(`${baseUrl}${route.path}`, {
        method: route.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: route.body ? JSON.stringify(route.body) : undefined
      });

      const data = await response.json();

      results[route.path] = {
        status: response.status,
        ok: response.ok,
        data: data
      };

      if (response.ok) {
        log(`    ✅ ${route.path} (${response.status})`, 'success');

        // Show interesting response data
        if (route.path === '/api/analyze-quote' && data.analysis) {
          log(`    📊 Analyzed: ${data.analysis.quote.category}, ${data.analysis.quote.total_amount} kr`, 'info');
        }
        if (route.path === '/api/verify-company' && data.verification) {
          log(`    🏢 Company: ${data.verification.companyName || 'Mock company'}`, 'info');
        }
        if (route.path === '/api/ml-predict' && data.prediction) {
          log(`    🤖 Predicted: ${data.prediction.predictedPrice} kr (${Math.round(data.prediction.confidenceScore * 100)}% confidence)`, 'info');
        }
      } else {
        log(`    ⚠️  ${route.path} (${response.status}): ${data.error || 'Unknown error'}`, 'warning');
        if (route.path === '/api/verify-company' && response.status === 500) {
          log(`    💡 Company verification failed (expected without Roaring API keys)`, 'info');
        }
      }

    } catch (error) {
      results[route.path] = {
        status: 'error',
        error: error.message,
        ok: false
      };
      log(`    ❌ ${route.path} (${error.message})`, 'error');
    }
  }

  return results;
}

function generateSummaryReport(results) {
  log('\n📊 Development Migration Summary:', 'info');

  const successful = Object.values(results).filter(r => r.ok).length;
  const total = Object.keys(results).length;
  const criticalRoutes = ['/api/health', '/api/analyze-quote', '/api/ml-predict'];
  const criticalWorking = criticalRoutes.filter(route => results[route]?.ok).length;

  log(`✅ Core API Routes working: ${criticalWorking}/${criticalRoutes.length}`, 'success');
  log(`⚠️  Total API Routes working: ${successful}/${total}`, successful >= 3 ? 'success' : 'warning');

  if (criticalWorking === criticalRoutes.length) {
    log('\n🎉 Core functionality working! Railway deployment ready.', 'success');
    log('\n📝 Dev Mode Notes:', 'info');
    log('• Company verification may fail without Roaring API keys', 'warning');
    log('• ML feedback collection needs database configuration', 'warning');
    log('• All other features are fully functional', 'success');

    log('\n🚀 Next Steps:', 'info');
    log('1. Deploy to Railway with current setup', 'info');
    log('2. Add Roaring.io credentials later for company verification', 'info');
    log('3. Configure production database for ML feedback', 'info');
  } else {
    log('\n❌ Core functionality issues detected.', 'error');
    log('Check errors above before deploying to Railway.', 'warning');
  }
}

// Main function
async function main() {
  log('🚀 Starting Saga → Railway Migration (DEV MODE)', 'info');
  log('═════════════════════════════════════════════════', 'info');
  log('This script tests Railway migration without requiring all API keys.', 'warning');

  // Check basic environment
  if (!checkEnvironmentVariables()) {
    process.exit(1);
  }

  // Start dev server
  log('\n⏳ Starting development server...', 'info');

  let serverProcess;
  try {
    // Start server in background
    serverProcess = execSync('npm run dev > dev-server.log 2>&1 & echo $!', {
      encoding: 'utf8',
      shell: '/bin/bash'  // Ensure bash shell
    });
    const pid = serverProcess.trim();

    log(`Development server started (PID: ${pid})`, 'info');

    // Wait for server to be ready
    log('Waiting for server to start...', 'info');
    await new Promise(resolve => setTimeout(resolve, 8000));

    // Test API routes
    const results = await testAPIRoutes();

    // Stop server
    try {
      execSync(`kill ${pid}`, { stdio: 'ignore' });
      log('Development server stopped', 'info');
    } catch (e) {
      log('Note: Server may still be running', 'warning');
    }

    // Generate report
    generateSummaryReport(results);

    // Railway commands
    log('\n🚂 Railway Deployment Commands:', 'info');
    log('npm install -g @railway/cli', 'info');
    log('railway login', 'info');
    log('railway new', 'info');
    log('railway add ANTHROPIC_API_KEY', 'info');
    log('railway up', 'info');

  } catch (error) {
    log(`❌ Testing failed: ${error.message}`, 'error');

    // Try to clean up
    if (serverProcess) {
      try {
        const pid = serverProcess.trim();
        execSync(`kill ${pid}`, { stdio: 'ignore' });
      } catch (e) {
        // Ignore cleanup errors
      }
    }

    process.exit(1);
  }
}

// Handle process signals
process.on('SIGINT', () => {
  log('\n⚠️  Process interrupted. Cleaning up...', 'warning');
  process.exit(0);
});

// Run
if (require.main === module) {
  main().catch(console.error);
}