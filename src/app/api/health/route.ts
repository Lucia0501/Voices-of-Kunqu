import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'

export async function GET(req: NextRequest) {
  const healthChecks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    status: 'healthy',
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: false,
      redis: false,
      openai: false
    }
  }

  try {
    // Database health check
    await prisma.$queryRaw`SELECT 1`
    healthChecks.checks.database = true
  } catch (error) {
    console.error('Database health check failed:', error)
  }

  try {
    // Redis health check
    await redis.ping()
    healthChecks.checks.redis = true
  } catch (error) {
    console.error('Redis health check failed:', error)
  }

  try {
    // OpenAI API health check
    if (process.env.OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      })
      healthChecks.checks.openai = response.ok
    }
  } catch (error) {
    console.error('OpenAI health check failed:', error)
  }

  const allHealthy = Object.values(healthChecks.checks).every(check => check)
  
  if (!allHealthy) {
    healthChecks.status = 'degraded'
    return NextResponse.json(healthChecks, { status: 503 })
  }

  return NextResponse.json(healthChecks, { status: 200 })
}