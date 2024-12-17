import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { RateLimiter } from 'limiter'

// Create a rate limiter: 5 requests per minute
const limiter = new RateLimiter({ tokensPerInterval: 5, interval: 'minute' })

export async function POST(request: Request) {
  // Check if we have any tokens left
  const remainingRequests = await limiter.removeTokens(1)
  if (remainingRequests < 0) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 })
  }

  try {
    const { apiKey, projectId } = await request.json()

    const auth = new google.auth.GoogleAuth({
      key: apiKey,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    })

    const cloudResourceManager = google.cloudresourcemanager({ version: 'v1', auth })

    const response = await cloudResourceManager.projects.getIamPolicy({
      resource: projectId,
    })

    const permissions = response.data.bindings.map(binding => binding.role)

    return NextResponse.json({ permissions })
  } catch (error) {
    console.error('Permission check error:', error)
    return NextResponse.json({ 
      error: 'An error occurred while checking permissions',
      details: error.message
    }, { status: 500 })
  }
}

