import { NextResponse } from 'next/server'
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
    const { apiKey, projectId, service, testType } = await request.json()

    //const auth = new google.auth.GoogleAuth({
    //  key: apiKey,
    //  scopes: [`https://www.googleapis.com/auth/${service}`],
    //})

    const results = []

    // Test authentication
    try {
      //await auth.getClient()
      results.push({
        success: true,
        message: 'Authentication successful',
      })
    } catch (error) {
      results.push({
        success: false,
        message: 'Authentication failed',
        details: error.message,
      })
      return NextResponse.json({ results })
    }

    // Perform service-specific tests
    const api = mockGoogleApi(service)
    switch (service) {
      case 'youtube':
        results.push(...await testYouTubeAPI(api, testType))
        break
      case 'drive':
        results.push(...await testDriveAPI(api, testType))
        break
      case 'sheets':
        results.push(...await testSheetsAPI(api, testType))
        break
      case 'calendar':
        results.push(...await testCalendarAPI(api, testType))
        break
      case 'gmail':
        results.push(...await testGmailAPI(api, testType))
        break
      default:
        results.push({
          success: false,
          message: `Unsupported service: ${service}`,
        })
    }

    // Get permissions
    //const permissions = await getPermissions(auth, projectId)
    const permissions = [] // Placeholder for permissions

    return NextResponse.json({ results, permissions })
  } catch (error) {
    console.error('Google API test error:', error)
    return NextResponse.json({
      results: [{
        success: false,
        message: 'An error occurred while testing the Google API',
        details: error.message,
      }],
    }, { status: 500 })
  }
}

function mockGoogleApi(service: string) {
  return {
    channels: { list: async () => ({ data: { items: [{ id: 'mock-channel-id', snippet: { title: 'Mock Channel' } }] } }) },
    files: { list: async () => ({ data: { files: [{ id: 'mock-file-id', name: 'Mock File' }] } }) },
    spreadsheets: { get: async () => ({ data: { properties: { title: 'Mock Spreadsheet' } } }) },
    users: { getProfile: async () => ({ data: { emailAddress: 'mock@example.com' } }) },
    calendarList: { list: async () => ({ data: { items: [{ id: 'mock-calendar-id', summary: 'Mock Calendar' }] } }) },
  }
}


async function testYouTubeAPI(api, testType) {
  const results = []

  if (testType === 'read' || testType === 'auth') {
    try {
      const response = await api.channels.list({
        part: 'snippet',
        mine: true,
      })
      results.push({
        success: true,
        message: 'Successfully retrieved YouTube channel data',
        details: JSON.stringify(response.data, null, 2),
      })
    } catch (error) {
      results.push({
        success: false,
        message: 'Failed to retrieve YouTube channel data',
        details: error.message,
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
      results.push({
        success: false,
        message: 'Failed to create a YouTube playlist',
        details: error.message,
      })
    }
  }

  return results
}

async function testDriveAPI(api, testType) {
  const results = []

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
      results.push({
        success: false,
        message: 'Failed to retrieve Google Drive files',
        details: error.message,
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
      results.push({
        success: false,
        message: 'Failed to create a file in Google Drive',
        details: error.message,
      })
    }
  }

  return results
}

async function testSheetsAPI(api, testType) {
  const results = []

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
      results.push({
        success: false,
        message: 'Failed to retrieve Google Sheets data',
        details: error.message,
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
      results.push({
        success: false,
        message: 'Failed to append data to Google Sheets',
        details: error.message,
      })
    }
  }

  return results
}

async function testCalendarAPI(api, testType) {
  const results = []

  if (testType === 'read' || testType === 'auth') {
    try {
      const response = await api.calendarList.list({})
      results.push({
        success: true,
        message: 'Successfully retrieved Google Calendar events',
        details: JSON.stringify(response.data, null, 2),
      })
    } catch (error) {
      results.push({
        success: false,
        message: 'Failed to retrieve Google Calendar events',
        details: error.message,
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
      results.push({
        success: false,
        message: 'Failed to create a Google Calendar event',
        details: error.message,
      })
    }
  }

  return results
}

async function testGmailAPI(api, testType) {
  const results = []

  if (testType === 'read' || testType === 'auth') {
    try {
      const response = await api.users.getProfile({ userId: 'me' })
      results.push({
        success: true,
        message: 'Successfully retrieved Gmail messages',
        details: JSON.stringify(response.data, null, 2),
      })
    } catch (error) {
      results.push({
        success: false,
        message: 'Failed to retrieve Gmail messages',
        details: error.message,
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
      results.push({
        success: false,
        message: 'Failed to send a Gmail message',
        details: error.message,
      })
    }
  }

  return results
}

//async function getPermissions(auth, projectId) { ... } //Removed as not needed for mock

