import { Suspense } from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'lib/auth'
import { ApiKeyManager } from 'components/api-key-manager'
import { ResultsDashboard } from 'components/results-dashboard'
import { LoginForm } from 'components/login-form'
import { TokenTestForm } from 'components/token-test-form'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Google API Testing Suite</h1>
      {session ? (
        <AuthenticatedView />
      ) : (
        <UnauthenticatedView />
      )}
    </div>
  )
}

function AuthenticatedView() {
  return (
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
          <div className="grid grid-cols-2 gap-4">
            {['youtube', 'drive', 'sheets', 'gmail', 'calendar'].map((api) => (
              <Button key={api} asChild className="w-full">
                <Link href={`/test/${api}`}>Test {api.charAt(0).toUpperCase() + api.slice(1)} API</Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function UnauthenticatedView() {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>Please log in to use the Google API Testing Suite</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-24">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
}

