import { Suspense } from 'react'
import { ApiKeyManager } from '@/components/api-key-manager'
import { ResultsDashboard } from '@/components/results-dashboard'
import { LoginForm } from '@/components/login-form'
import { TokenTestForm } from '@/components/token-test-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

export default async function Home() {
  let session;
  let error = null;

  try {
    session = await getServerSession(authOptions)
  } catch (e) {
    console.error("Failed to load user session:", e)
    error = e instanceof Error ? e : new Error('An unknown error occurred')
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load user session</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">An error occurred while loading your session: {error.message}</p>
          <p className="mb-4">Please try again later or contact support if the problem persists.</p>
          <Button asChild>
            <Link href="/auth/signin">Try Again</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Google API Testing Suite</h1>
      {session ? (
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>API Key Management</CardTitle>
              <CardDescription>Manage your Google API keys</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <ApiKeyManager />
              </Suspense>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>View your recent API test results</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <ResultsDashboard />
              </Suspense>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Token Testing</CardTitle>
              <CardDescription>Test your API tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <TokenTestForm />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Available API Tests</CardTitle>
              <CardDescription>Select an API to test</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild>
                  <Link href="/test/youtube">Test YouTube API</Link>
                </Button>
                <Button asChild>
                  <Link href="/test/drive">Test Google Drive API</Link>
                </Button>
                <Button asChild>
                  <Link href="/test/sheets">Test Google Sheets API</Link>
                </Button>
                <Button asChild>
                  <Link href="/test/gmail">Test Gmail API</Link>
                </Button>
                <Button asChild>
                  <Link href="/test/calendar">Test Google Calendar API</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Please log in to use the Google API Testing Suite</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-24">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
}

