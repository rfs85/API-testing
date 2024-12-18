import { NextResponse } from 'next/server'
import { RateLimiter } from 'limiter'
import { google, youtube_v3, drive_v3, sheets_v4, calendar_v3, gmail_v1 } from 'googleapis'

// Create a rate limiter: 5 requests per minute
const limiter = new RateLimiter({ tokensPerInterval: 5, interval: 'minute' })

export async function POST(request: Request) {
  // Check if we have any tokens left
  const remainingRequests = await limiter.removeTokens(1)
  if (remainingRequests < 0) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 })
  }

  try {
    const { apiKey, service, testType } = await request.json()

    const auth = new google.auth.GoogleAuth({
      scopes: [`https://www.googleapis.com/auth/${service}`],
    })

    const results: Array<{ success: boolean; message: string; details?: string }> = []

    // Test authentication
    try {
      await auth.getClient()
      results.push({
        success: true,
        message: 'Authentication successful',
      })
    } catch (error) {
      const err = error as Error
      results.push({
        success: false,
        message: 'Authentication failed',
        details: err.message,
      })
      return NextResponse.json({ results })
    }

    // Perform service-specific tests
    let api: any
    switch (service) {
      case 'youtube':
        api = google.youtube({ version: 'v3', auth, params: { key: apiKey } }) as youtube_v3.Youtube
        results.push(...await testYouTubeAPI(api, testType))
        break
      case 'drive':
        api = google.drive({ version: 'v3', auth, params: { key: apiKey } }) as drive_v3.Drive
        results.push(...await testDriveAPI(api, testType))
        break
      case 'sheets':
        api = google.sheets({ version: 'v4', auth, params: { key: apiKey } }) as sheets_v4.Sheets
        results.push(...await testSheetsAPI(api, testType))
        break
      case 'calendar':
        api = google.calendar({ version: 'v3', auth, params: { key: apiKey } }) as calendar_v3.Calendar
        results.push(...await testCalendarAPI(api, testType))
        break
      case 'gmail':
        api = google.gmail({ version: 'v1', auth, params: { key: apiKey } }) as gmail_v1.Gmail
        results.push(...await testGmailAPI(api, testType))
        break
      default:
        results.push({
          success: false,
          message: `Unsupported service: ${service}`,
        })
    }

    // Get permissions
    const permissions: any[] = [] // Placeholder for permissions

    return NextResponse.json({ results, permissions })
  } catch (error) {
    const err = error as Error
    console.error('Google API test error:', err)
    return NextResponse.json({
      results: [{
        success: false,
        message: 'An error occurred while testing the Google API',
        details: err.message,
      }],
    }, { status: 500 })
  }
}

async function testYouTubeAPI(api: youtube_v3.Youtube, testType: string) {
  const results: Array<{ success: boolean; message: string; details?: string }> = []

  if (testType === 'read' || testType === 'auth') {
    try {
      const response = await api.channels.list({
        part: ['snippet'],
        mine: true,
      })
      results.push({
        success: true,
        message: 'Successfully retrieved YouTube channel data',
        details: JSON.stringify(response.data, null, 2),
      })
    } catch (error) {
      const err = error as Error
      results.push({
        success: false,
        message: 'Failed to retrieve YouTube channel data',
        details: err.message,
      })
    }
  }

  if (testType === 'write') {
    try {
      //const response = await api.playlists.insert({...})  //No write functionality in mock
      results.push({
        success: true,
        message: 'Successfully created a YouTube playlist (mock)',
        details: 'Mock response',
      })
    } catch (error) {
      const err = error as Error
      results.push({
        success: false,
        message: 'Failed to create a YouTube playlist',
        details: err.message,
      })
    }
  }

  return results
}

async function testDriveAPI(api: drive_v3.Drive, testType: string) {
  const results: Array<{ success: boolean; message: string; details?: string }> = []

  if (testType === 'read' || testType === 'auth') {
    try {
      const response = await api.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
      })
      results.push({
        success: true,
        message: 'Successfully retrieved Google Drive files',
        details: JSON.stringify(response.data, null, 2),
      })
    } catch (error) {
      const err = error as Error
      results.push({
        success: false,
        message: 'Failed to retrieve Google Drive files',
        details: err.message,
      })
    }
  }

  if (testType === 'write') {
    try {
      //const response = await api.files.create({...}) //No write functionality in mock
      results.push({
        success: true,
        message: 'Successfully created a file in Google Drive (mock)',
        details: 'Mock response',
      })
    } catch (error) {
      const err = error as Error
      results.push({
        success: false,
        message: 'Failed to create a file in Google Drive',
        details: err.message,
      })
    }
  }

  return results
}

async function testSheetsAPI(api: sheets_v4.Sheets, testType: string) {
  const results: Array<{ success: boolean; message: string; details?: string }> = []

  if (testType === 'read' || testType === 'auth') {
    try {
      const response = await api.spreadsheets.get({
        spreadsheetId: 'your-test-spreadsheet-id',
      })
      results.push({
        success: true,
        message: 'Successfully retrieved Google Sheets data',
        details: JSON.stringify(response.data, null, 2),
      })
    } catch (error) {
      const err = error as Error
      results.push({
        success: false,
        message: 'Failed to retrieve Google Sheets data',
        details: err.message,
      })
    }
  }

  if (testType === 'write') {
    try {
      //const response = await api.spreadsheets.values.append({...}) //No write functionality in mock
      results.push({
        success: true,
        message: 'Successfully appended data to Google Sheets (mock)',
        details: 'Mock response',
      })
    } catch (error) {
      const err = error as Error
      results.push({
        success: false,
        message: 'Failed to append data to Google Sheets',
        details: err.message,
      })
    }
  }

  return results
}

async function testCalendarAPI(api: calendar_v3.Calendar, testType: string) {
  const results: Array<{ success: boolean; message: string; details?: string }> = []

  if (testType === 'read' || testType === 'auth') {
    try {
      const response = await api.calendarList.list({})
      results.push({
        success: true,
        message: 'Successfully retrieved Google Calendar events',
        details: JSON.stringify(response.data, null, 2),
      })
    } catch (error) {
      const err = error as Error
      results.push({
        success: false,
        message: 'Failed to retrieve Google Calendar events',
        details: err.message,
      })
    }
  }

  if (testType === 'write') {
    try {
      //const response = await api.events.insert({...}) //No write functionality in mock
      results.push({
        success: true,
        message: 'Successfully created a Google Calendar event (mock)',
        details: 'Mock response',
      })
    } catch (error) {
      const err = error as Error
      results.push({
        success: false,
        message: 'Failed to create a Google Calendar event',
        details: err.message,
      })
    }
  }

  return results
}

async function testGmailAPI(api: gmail_v1.Gmail, testType: string) {
  const results: Array<{ success: boolean; message: string; details?: string }> = []

  if (testType === 'read' || testType === 'auth') {
    try {
      const response = await api.users.getProfile({ userId: 'me' })
      results.push({
        success: true,
        message: 'Successfully retrieved Gmail messages',
        details: JSON.stringify(response.data, null, 2),
      })
    } catch (error) {
      const err = error as Error
      results.push({
        success: false,
        message: 'Failed to retrieve Gmail messages',
        details: err.message,
      })
    }
  }

  if (testType === 'write') {
    try {
      //const response = await api.users.messages.send({...}) //No write functionality in mock
      results.push({
        success: true,
        message: 'Successfully sent a Gmail message (mock)',
        details: 'Mock response',
      })
    } catch (error) {
      const err = error as Error
      results.push({
        success: false,
        message: 'Failed to send a Gmail message',
        details: err.message,
      })
    }
  }

  return results
}

//async function getPermissions(auth, projectId) { ... } //Removed as not needed for mock
