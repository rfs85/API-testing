"use client"

import { useState } from 'react'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { useToast } from 'hooks/use-toast'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from 'components/ui/alert'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from 'components/ui/badge'
import { Progress } from 'components/ui/progress'

const API_SERVICES = [
  { value: 'youtube', label: 'YouTube Data API' },
  { value: 'drive', label: 'Google Drive API' },
  { value: 'sheets', label: 'Google Sheets API' },
  { value: 'calendar', label: 'Google Calendar API' },
  { value: 'gmail', label: 'Gmail API' },
]

interface TestResult {
  success: boolean
  message: string
  details?: string
}

export default function GoogleApiForm() {
  const [apiKey, setApiKey] = useState('')
  const [projectId, setProjectId] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [testType, setTestType] = useState('auth')
  const [isLoading, setIsLoading] = useState(false)
  const [permissions, setPermissions] = useState<string[]>([])
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTestResults([])
    setProgress(0)

    try {
      const response = await fetch('/api/test-google-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey, projectId, service: selectedService, testType }),
      })

      if (!response.ok) {
        throw new Error('API test failed')
      }

      const data = await response.json()
      setTestResults(data.results)
      setPermissions(data.permissions || [])

      toast({
        title: 'Google API Test Complete',
        description: `Completed ${data.results.length} test(s) for ${selectedService}`,
      })
    } catch (error) {
      console.error('Google API test error:', error)
      toast({
        title: 'Google API Test Failed',
        description: 'An error occurred while testing the Google API',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      setProgress(100)
    }
  }

  const checkPermissions = async () => {
    setIsLoading(true)
    setPermissions([])
    setProgress(0)

    try {
      const response = await fetch('/api/check-google-permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey, projectId }),
      })

      if (!response.ok) {
        throw new Error('Failed to check permissions')
      }

      const data = await response.json()
      setPermissions(data.permissions)
      toast({
        title: 'Permissions Checked',
        description: `Retrieved ${data.permissions.length} permission(s) for the provided API key`,
      })
    } catch (error) {
      console.error('Permission check error:', error)
      toast({
        title: 'Permission Check Failed',
        description: 'An error occurred while checking permissions',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      setProgress(100)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Google API Test Form</CardTitle>
        <CardDescription>Test your Google API credentials and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
              placeholder="Enter your Google API Key"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="projectId">Project ID</Label>
            <Input
              id="projectId"
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
              placeholder="Enter your Google Cloud Project ID"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="service">Select Google API Service</Label>
            <Select onValueChange={setSelectedService} value={selectedService}>
              <SelectTrigger id="service">
                <SelectValue placeholder="Select a Google API service" />
              </SelectTrigger>
              <SelectContent>
                {API_SERVICES.map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Tabs defaultValue="auth" onValueChange={setTestType} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="auth">Authentication</TabsTrigger>
              <TabsTrigger value="read">Read Data</TabsTrigger>
              <TabsTrigger value="write">Write Data</TabsTrigger>
            </TabsList>
            <TabsContent value="auth">Test API authentication and access</TabsContent>
            <TabsContent value="read">Test reading data from the selected API</TabsContent>
            <TabsContent value="write">Test writing data to the selected API</TabsContent>
          </Tabs>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="submit" disabled={isLoading || !selectedService} onClick={handleSubmit}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Google API'
          )}
        </Button>
        <Button onClick={checkPermissions} disabled={isLoading || !apiKey || !projectId} variant="outline">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            'Check Permissions'
          )}
        </Button>
      </CardFooter>
      {isLoading && (
        <CardContent>
          <Progress value={progress} className="w-full" />
        </CardContent>
      )}
      {permissions.length > 0 && (
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="permissions">
              <AccordionTrigger>Permissions and Capabilities</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2">
                  {permissions.map((permission, index) => (
                    <Badge key={index} variant="secondary">{permission}</Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      )}
      {testResults.length > 0 && (
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
          {testResults.map((result, index) => (
            <Alert key={index} variant={result.success ? 'default' : 'destructive'} className="mb-4">
              <AlertTitle className="flex items-center">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                )}
                {result.success ? 'Success' : 'Error'}
              </AlertTitle>
              <AlertDescription>
                {result.message}
                {result.details && (
                  <Accordion type="single" collapsible className="mt-2">
                    <AccordionItem value="details">
                      <AccordionTrigger>Details</AccordionTrigger>
                      <AccordionContent>
                        <pre className="whitespace-pre-wrap text-sm bg-muted p-2 rounded">{result.details}</pre>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      )}
    </Card>
  )
}
