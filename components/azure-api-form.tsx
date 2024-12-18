'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorBoundary } from '@/components/error-boundary'

export default function AzureApiForm() {
  const [apiKey, setApiKey] = useState('')
  const [subscriptionId, setSubscriptionId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/test-azure-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey, subscriptionId }),
      })

      if (!response.ok) {
        throw new Error('API test failed')
      }

      const data = await response.json()
      toast({
        title: 'Azure API Test Successful',
        description: data.result,
      })
    } catch (error) {
      console.error('Azure API test error:', error)
      toast({
        title: 'Azure API Test Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred while testing the Azure API',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Azure API Test Form</CardTitle>
      </CardHeader>
      <CardContent>
        <ErrorBoundary>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
                aria-label="Azure API Key"
              />
            </div>
            <div>
              <Label htmlFor="subscriptionId">Subscription ID</Label>
              <Input
                id="subscriptionId"
                type="text"
                value={subscriptionId}
                onChange={(e) => setSubscriptionId(e.target.value)}
                required
                aria-label="Azure Subscription ID"
              />
            </div>
          </form>
        </ErrorBoundary>
      </CardContent>
      <CardFooter>
        <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? 'Testing...' : 'Test Azure API'}
        </Button>
      </CardFooter>
    </Card>
  )
}
