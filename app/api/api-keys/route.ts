import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    if (!client) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    const db = client.db('google_api_testing')
    const apiKeys = await db.collection('api_keys').find({ userId: session.user.id }).toArray()
    return NextResponse.json(apiKeys)
  } catch (error) {
    console.error('Failed to fetch API keys:', error)
    return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    if (!client) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    const db = client.db('google_api_testing')
    const { name, key, projectId } = await request.json()
    const newApiKey = {
      userId: session.user.id,
      name,
      key,
      projectId,
      createdAt: new Date()
    }
    const result = await db.collection('api_keys').insertOne(newApiKey)
    return NextResponse.json({ ...newApiKey, _id: result.insertedId })
  } catch (error) {
    console.error('Failed to add API key:', error)
    return NextResponse.json({ error: 'Failed to add API key' }, { status: 500 })
  }
}

