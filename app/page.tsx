import { Suspense } from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../lib/auth'
import { ApiKeyManager } from '../components/api-key-manager'
import { ResultsDashboard } from '../components/results-dashboard'
import { LoginForm } from '../components/login-form'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import Link from 'next/link'
import { Loader2, Zap, Shield, Rocket, Youtube, FileText, Mail, Calendar } from 'lucide-react'

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
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<Zap className="h-6 w-6" />}
          title="Quick API Testing"
          description="Test Google APIs with just a few clicks. Get instant results and validate your integrations."
        />
        <FeatureCard
          icon={<Shield className="h-6 w-6" />}
          title="Secure Token Management"
          description="Safely store and manage your API keys. Your credentials are encrypted and protected."
        />
        <FeatureCard
          icon={<Rocket className="h-6 w-6" />}
          title="Comprehensive Results"
          description="View detailed test results, including success rates, error messages, and performance metrics."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Supported APIs</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ApiCard icon={<Youtube />} name="YouTube Data API" route="/api-tests/youtube" />
          <ApiCard icon={<FileText />} name="Google Drive API" route="/api-tests/drive" />
          <ApiCard icon={<FileText />} name="Google Sheets API" route="/api-tests/sheets" />
          <ApiCard icon={<Mail />} name="Gmail API" route="/api-tests/gmail" />
          <ApiCard icon={<Calendar />} name="Google Calendar API" route="/api-tests/calendar" />
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
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
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>Get started with API testing in 3 easy steps</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Add your Google API key in the API Key Management section</li>
              <li>Select an API to test from the Supported APIs section</li>
              <li>Run your test and view the results in the Test Results dashboard</li>
            </ol>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function UnauthenticatedView() {
  return (
    <div className="space-y-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Please log in to use the Google API Testing Suite</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-center">Why Use Our API Testing Suite?</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="Effortless Testing"
            description="Streamline your API testing process with our user-friendly interface."
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6" />}
            title="Secure Environment"
            description="Your API keys and test data are handled with the utmost security."
          />
          <FeatureCard
            icon={<Rocket className="h-6 w-6" />}
            title="Comprehensive Support"
            description="Test multiple Google APIs in one place, from YouTube to Gmail."
          />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

function ApiCard({ icon, name, route }: { icon: React.ReactNode; name: string; route: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle>{name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href={route}>Test {name}</Link>
        </Button>
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
