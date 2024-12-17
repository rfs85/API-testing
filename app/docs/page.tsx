import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card'

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Documentation</h1>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Learn how to use the Google API Testing Suite</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Sign up for a Google Cloud account and create a new project.</li>
              <li>Enable the APIs you want to test in the Google Cloud Console.</li>
              <li>Create an API key for your project.</li>
              <li>Use the API key and project ID in our testing form.</li>
              <li>Select the API service you want to test.</li>
              <li>Choose the type of test (Authentication, Read, or Write).</li>
              <li>Click "Test Google API" to run the test.</li>
            </ol>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Supported APIs</CardTitle>
            <CardDescription>List of Google APIs currently supported by our testing suite</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>YouTube Data API</li>
              <li>Google Drive API</li>
              <li>Google Sheets API</li>
              <li>Google Calendar API</li>
              <li>Gmail API</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
            <CardDescription>Common issues and their solutions</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="font-semibold">Authentication Failed</dt>
                <dd>Ensure that your API key is correct and has the necessary permissions for the selected API.</dd>
              </div>
              <div>
                <dt className="font-semibold">API Not Enabled</dt>
                <dd>Make sure you've enabled the API you're trying to test in the Google Cloud Console.</dd>
              </div>
              <div>
                <dt className="font-semibold">Quota Exceeded</dt>
                <dd>Check your Google Cloud Console to ensure you haven't exceeded your API quota limits.</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

