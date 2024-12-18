import { useState } from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GoogleDriveTestForm } from '@/components/google-drive-test-form'

export default async function GoogleDriveTestPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <div>Please log in to access this page.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Google Drive API Test</h1>
      <GoogleDriveTestForm />
    </div>
  )
}


// components/google-drive-test-form.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function GoogleDriveTestForm() {
  const [apiKey, setApiKey] = useState('')
  const [folderId, setFolderId] = useState('')
  const [fileId, setFileId] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileContent, setFileContent] = useState('')
  const [testType, setTestType] = useState('read')
  const [isLoading, setIsLoading] = useState(false)
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

  return (
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
                  <Input
                    id="fileContent"
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    placeholder="Enter content for the new file"
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
  )
}

