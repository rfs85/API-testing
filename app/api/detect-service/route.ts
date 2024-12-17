import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    // This is a simplified detection logic. In a real-world scenario,
    // you would need to implement more robust token validation and detection.
    let service = 'Unknown'

    if (token.startsWith('goog_')) {
      service = 'Google'
    } else if (token.startsWith('az_')) {
      service = 'Azure'
    }

    return NextResponse.json({ service })
  } catch (error) {
    console.error('Service detection error:', error)
    return NextResponse.json({ error: 'An error occurred while detecting the service' }, { status: 500 })
  }
}

