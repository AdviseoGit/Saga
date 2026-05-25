// Health check endpoint för Railway
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health checks
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        api: 'up',
        anthropic: process.env.ANTHROPIC_API_KEY ? 'configured' : 'missing',
        roaring: (process.env.ROARING_CLIENT_ID && process.env.ROARING_CLIENT_SECRET) ? 'configured' : 'missing'
      }
    };

    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}