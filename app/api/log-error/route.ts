import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('google_api_testing')
    const { service, error, details } = await request.json()
    
    const logEntry = {
      createdAt: new Date(),
      service,
      error,
      details
    }
    
    const result = await db.collection('error_logs').insertOne(logEntry)
    return NextResponse.json({ ...logEntry, _id: result.insertedId })
  } catch (error) {
    console.error('Failed to log error:', error)
    return NextResponse.json({ error: 'Failed to log error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('google_api_testing')
    const errorLogs = await db.collection('error_logs').find({}).sort({ createdAt: -1 }).limit(50).toArray()
    return NextResponse.json(errorLogs)
  } catch (error) {
    console.error('Failed to fetch error logs:', error)
    return NextResponse.json({ error: 'Failed to fetch error logs' }, { status: 500 })
  }
}

