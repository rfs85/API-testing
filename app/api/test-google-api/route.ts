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
    const { apiKey, projectId, service, testType } = await request.json()

    const auth = new google.auth.GoogleAuth({
      key: apiKey,
      scopes: [`https://www.googleapis.com/auth/${service}`],
    })

    const results = []

    // Test authentication
    try {
      await auth.getClient()
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
    switch (service) {
      case 'youtube':
        results.push(...await testYouTubeAPI(auth, testType))
        break
      case 'drive':
        results.push(...await testDriveAPI(auth, testType))
        break
      case 'sheets':
        results.push(...await testSheetsAPI(auth, testType))
        break
      case 'calendar':
        results.push(...await testCalendarAPI(auth, testType))
        break
      case 'gmail':
        results.push(...await testGmailAPI(auth, testType))
        break
      default:
        results.push({
          success: false,
          message: `Unsupported service: ${service}`,
        })
    }

    // Get permissions
    const permissions = await getPermissions(auth, projectId)

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

async function testYouTubeAPI(auth, testType) {
  const youtube = google.youtube({ version: 'v3', auth })
  const results = []

  if (testType === 'read' || testType === 'auth') {
    try {
      const response = await youtube.channels.list({
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
      const response = await youtube.playlists.insert({
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title: 'Test Playlist',
            description: 'A test playlist created by the API',
          },
          status: {
            privacyStatus: 'private',
          },
        },
      })
      results.push({
        success: true,
        message: 'Successfully created a YouTube playlist',
        details: JSON.stringify(response.data, null, 2),
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

async function testDriveAPI(auth, testType) {
  const drive = google.drive({ version: 'v3', auth })
  const results = []

  if (testType === 'read' || testType === 'auth') {
    try {
      const response = await drive.files.list({
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
      const response = await drive.files.create({
        requestBody: {
          name: 'Test File',
          mimeType: 'text/plain',
        },
        media: {
          mimeType: 'text/plain',
          body: 'Hello World',
        },
      })
      results.push({
        success: true,
        message: 'Successfully created a file in Google Drive',
        details: JSON.stringify(response.data, null, 2),
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

async function testSheetsAPI(auth, testType) {
  const sheets = google.sheets({ version: 'v4', auth })
  const results = []

  if (testType === 'read' || testType === 'auth') {
    try {
      const response = await sheets.spreadsheets.get({
        spreadsheetId: 'your-test-spreadsheet-id',
      })
      results.push({
        success: true,
        message: 'Successfully retrieved Google Sheets data',
        details: JSON.stringify(response.data, null, 2),
      })
    } catch(error) {
      results.push({
        success: false,
        message: 'Failed to retrieve Google Sheets data',
        details: error.message,
      })
    }
  }

  if (testType === 'write') {
    try {
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: 'your-test-spreadsheet-id',
        range: 'Sheet1!A1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [['Test', 'Data', new Date().toISOString()]],
        },
      })
      results.push({
        success: true,
        message: 'Successfully appended data to Google Sheets',
        details: JSON.stringify(response.data, null, 2),
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

async function testCalendarAPI(auth, testType) {
  const calendar = google.calendar({ version: 'v3', auth })
  const results = []

  if (testType === 'read' || testType === 'auth') {
    try {
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      })
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
      const event = {
        summary: 'Test Event',
        location: 'Virtual',
        description: 'A test event created by the API',
        start: {
          dateTime: new Date().toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: new Date(Date.now() + 3600000).toISOString(),
          timeZone: 'UTC',
        },
      }

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      })
      results.push({
        success: true,
        message: 'Successfully created a Google Calendar event',
        details: JSON.stringify(response.data, null, 2),
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

async function testGmailAPI(auth, testType) {
  const gmail = google.gmail({ version: 'v1', auth })
  const results = []

  if (testType === 'read' || testType === 'auth') {
    try {
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 10,
      })
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
      const message = [
        'From: "Test User" <test@example.com>',
        'To: test@example.com',
        'Subject: Test Email',
        '',
        'This is a test email sent by the Gmail API.',
      ].join('\n')

      const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

      const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      })
      results.push({
        success: true,
        message: 'Successfully sent a Gmail message',
        details: JSON.stringify(response.data, null, 2),
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

async function getPermissions(auth, projectId) {
  const cloudResourceManager = google.cloudresourcemanager({ version: 'v1', auth })
  try {
    const response = await cloudResourceManager.projects.getIamPolicy({
      resource: projectId,
    })
    return response.data.bindings.map(binding => binding.role)
  } catch (error) {
    console.error('Failed to retrieve permissions:', error)
    return []
  }
}

