"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from 'components/ui/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

export default function DriveApiTestPage() {
  const [apiKey, setApiKey] = useState('')
  const [folderId, setFolderId] = useState('')
  const [fileId, setFileId] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileContent, setFileContent] = useState('')
  const [testType, setTestType] = useState('read')
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/test-drive-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey, folderId, fileId, fileName, fileContent, testType }),
      })

      if (!response.ok) {
        throw new Error('API test failed')
      }

      const data = await response.json()
      toast({
        title: 'Google Drive API Test Complete',
        description: data.message,
      })
    } catch (error) {
      console.error('Google Drive API test error:', error)
      toast({
        title: 'Google Drive API Test Failed',
        description: 'An error occurred while testing the Google Drive API',
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
      <h1 className="text-3xl font-bold">Google Drive API Test</h1>
      <Card>
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
          <CardDescription>Configure your Google Drive API test</CardDescription>
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
                placeholder="Enter your Google Drive API Key"
              />
            </div>
            <Tabs defaultValue="read" onValueChange={(value) => setTestType(value as 'read' | 'write')}>
              <TabsList>
                <TabsTrigger value="read">Read Data</TabsTrigger>
                <TabsTrigger value="write">Write Data</TabsTrigger>
              </TabsList>
              <TabsContent value="read">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="folderId">Folder ID</Label>
                    <Input
                      id="folderId"
                      value={folderId}
                      onChange={(e) => setFolderId(e.target.value)}
                      placeholder="Enter a Google Drive Folder ID"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fileId">File ID</Label>
                    <Input
                      id="fileId"
                      value={fileId}
                      onChange={(e) => setFileId(e.target.value)}
                      placeholder="Enter a Google Drive File ID"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="write">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fileName">File Name</Label>
                    <Input
                      id="fileName"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="Enter a name for the new file"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fileContent">File Content</Label>
                    <Textarea
                      id="fileContent"
                      value={fileContent}
                      onChange={(e) => setFileContent(e.target.value)}
                      placeholder="Enter the content for the new file"
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
            {isLoading ? 'Testing...' : 'Run Google Drive API Test'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

