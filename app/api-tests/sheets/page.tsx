"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

export default function SheetsApiTestPage() {
  const [apiKey, setApiKey] = useState('')
  const [spreadsheetId, setSpreadsheetId] = useState('')
  const [range, setRange] = useState('')
  const [values, setValues] = useState('')
  const [testType, setTestType] = useState('read')
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/test-sheets-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey, spreadsheetId, range, values, testType }),
      })

      if (!response.ok) {
        throw new Error('API test failed')
      }

      const data = await response.json()
      toast({
        title: 'Google Sheets API Test Complete',
        description: data.message,
      })
    } catch (error) {
      console.error('Google Sheets API test error:', error)
      toast({
        title: 'Google Sheets API Test Failed',
        description: 'An error occurred while testing the Google Sheets API',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div>Please log in to access this page.</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Google Sheets API Test</h1>
      <Card>
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
          <CardDescription>Configure your Google Sheets API test</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
                placeholder="Enter your Google Sheets API Key"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="spreadsheetId">Spreadsheet ID</Label>
              <Input
                id="spreadsheetId"
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                required
                placeholder="Enter the Spreadsheet ID"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="range">Range</Label>
              <Input
                id="range"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                required
                placeholder="Enter the range (e.g., Sheet1!A1:B10)"
              />
            </div>
            <Tabs defaultValue="read" onValueChange={(value) => setTestType(value as 'read' | 'write')}>
              <TabsList>
                <TabsTrigger value="read">Read Data</TabsTrigger>
                <TabsTrigger value="write">Write Data</TabsTrigger>
              </TabsList>
              <TabsContent value="read">
                <p className="text-sm text-muted-foreground">Click "Run Google Sheets API Test" to read data from the specified range.</p>
              </TabsContent>
              <TabsContent value="write">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="values">Values to Write</Label>
                    <Textarea
                      id="values"
                      value={values}
                      onChange={(e) => setValues(e.target.value)}
                      placeholder="Enter comma-separated values (e.g., value1,value2,value3)"
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? 'Testing...' : 'Run Google Sheets API Test'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
