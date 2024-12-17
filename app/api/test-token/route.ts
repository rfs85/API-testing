import { NextResponse } from 'next/server'

function mockGoogleApi(service: string) {
  return {
    channels: { list: async () => ({ data: { items: [{ id: 'mock-channel-id', snippet: { title: 'Mock Channel' } }] } }) },
    files: { list: async () => ({ data: { files: [{ id: 'mock-file-id', name: 'Mock File' }] } }) },
    spreadsheets: { get: async () => ({ data: { properties: { title: 'Mock Spreadsheet' } } }) },
    users: { getProfile: async () => ({ data: { emailAddress: 'mock@example.com' } }) },
    calendarList: { list: async () => ({ data: { items: [{ id: 'mock-calendar-id', summary: 'Mock Calendar' }] } }) },
  }
}

export async function POST(request: Request) {
  try {
    const { token, service } = await request.json()

    let api;
    switch (service) {
      case 'youtube':
        api = mockGoogleApi(service)
        await api.channels.list({ part: ['snippet'], mine: true })
        break
      case 'drive':
        api = mockGoogleApi(service)
        await api.files.list({ pageSize: 1 })
        break
      case 'sheets':
        api = mockGoogleApi(service)
        await api.spreadsheets.get({ spreadsheetId: 'your-test-spreadsheet-id' })
        break
      case 'gmail':
        api = mockGoogleApi(service)
        await api.users.getProfile({ userId: 'me' })
        break
      case 'calendar':
        api = mockGoogleApi(service)
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

