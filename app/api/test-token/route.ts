import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function POST(request: Request) {
  try {
    const { token, service } = await request.json()

    let api;
    switch (service) {
      case 'youtube':
        api = google.youtube({ version: 'v3', auth: token })
        await api.channels.list({ part: ['snippet'], mine: true })
        break
      case 'drive':
        api = google.drive({ version: 'v3', auth: token })
        await api.files.list({ pageSize: 1 })
        break
      case 'sheets':
        api = google.sheets({ version: 'v4', auth: token })
        await api.spreadsheets.get({ spreadsheetId: 'your-test-spreadsheet-id' })
        break
      case 'gmail':
        api = google.gmail({ version: 'v1', auth: token })
        await api.users.getProfile({ userId: 'me' })
        break
      case 'calendar':
        api = google.calendar({ version: 'v3', auth: token })
        await api.calendarList.list()
        break
      default:
        throw new Error('Invalid service specified')
    }

    return NextResponse.json({ success: true, message: 'Token is valid' })
  } catch (error) {
    console.error('Token test error:', error)
    return NextResponse.json({ success: false, message: 'Token is invalid' }, { status: 400 })
  }
}

