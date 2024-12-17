import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('google_api_testing')
    const testResults = await db.collection('test_results').find({}).sort({ createdAt: -1 }).limit(50).toArray()
    return NextResponse.json(testResults)
  } catch (error) {
    console.error('Failed to fetch test results:', error)
    return NextResponse.json({ error: 'Failed to fetch test results' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('google_api_testing')
    const data = await request.json()
    const result = {
      createdAt: new Date(),
      ...data
    }
    const insertResult = await db.collection('test_results').insertOne(result)
    return NextResponse.json({ ...result, _id: insertResult.insertedId })
  } catch (error) {
    console.error('Failed to save test result:', error)
    return NextResponse.json({ error: 'Failed to save test result' }, { status: 500 })
  }
}

