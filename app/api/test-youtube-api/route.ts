import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function POST(request: Request) {
  try {
    const { apiKey, channelId, videoId, playlistId, testType } = await request.json()

    const youtube = google.youtube({
      version: 'v3',
      auth: apiKey,
    })

    let result
    let success = false
    let message = ''
    let details = ''

    try {
      if (testType === 'read') {
        if (channelId) {
          const response = await youtube.channels.list({
            part: ['snippet', 'statistics'],
            id: [channelId],
          })
          result = response.data
          success = true
          message = 'Successfully retrieved channel data'
        } else if (videoId) {
          const response = await youtube.videos.list({
            part: ['snippet', 'statistics'],
            id: [videoId],
          })
          result = response.data
          success = true
          message = 'Successfully retrieved video data'
        }
      } else if (testType === 'write') {
        if (playlistId) {
          const response = await youtube.playlistItems.insert({
            part: ['snippet'],
            requestBody: {
              snippet: {
                playlistId: playlistId,
                resourceId: {
                  kind: 'youtube#video',
                  videoId: videoId,
                },
              },
            },
          })
          result = response.data
          success = true
          message = 'Successfully added video to playlist'
        }
      }

      details = JSON.stringify(result, null, 2)
    } catch (error) {
      success = false
      message = 'API test failed'
      details = error.message

      // Log the error
      await fetch('/api/log-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service: 'YouTube',
          error: message,
          details: details,
        }),
      })
    }

    // Save the test result
    await fetch('/api/test-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service: 'YouTube',
        success,
        message,
        details,
      }),
    })

    return NextResponse.json({ success, message, details })
  } catch (error) {
    console.error('YouTube API test error:', error)
    return NextResponse.json({ error: 'An error occurred while testing the YouTube API' }, { status: 500 })
  }
}

