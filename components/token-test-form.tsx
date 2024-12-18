"use client"

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useToast } from '../hooks/use-toast'
import { Loader2 } from 'lucide-react'

const API_SERVICES = [
  { value: 'youtube', label: 'YouTube Data API' },
  { value: 'drive', label: 'Google Drive API' },
  { value: 'sheets', label: 'Google Sheets API' },
  { value: 'gmail', label: 'Gmail API' },
  { value: 'calendar', label: 'Google Calendar API' },
]

export function TokenTestForm() {
  const [token, setToken] = useState('')
  const [service, setService] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchData = async () => {
    // Define your data fetching logic here
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/test-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, service }),
      })

      if (!response.ok) {
        throw new Error('Token test failed')
      }

      toast({
        title: 'Token Test Successful',
        description: `Your ${service} API token is valid.`,
      })
    } catch (error) {
      console.error('Token test error:', error)
      toast({
        title: 'Token Test Failed',
        description: 'Your API token could not be validated. Please check and try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Your API Token</CardTitle>
        <CardDescription>Validate your Google API token for a specific service</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">API Token</Label>
            <Input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              placeholder="Enter your API token"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="service">API Service</Label>
            <Select value={service} onValueChange={setService} required>
              <SelectTrigger id="service">
                <SelectValue placeholder="Select an API service" />
              </SelectTrigger>
              <SelectContent>
                {API_SERVICES.map((apiService) => (
                  <SelectItem key={apiService.value} value={apiService.value}>
                    {apiService.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isLoading || !token || !service}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Token'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
