"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface TestResult {
  id: string
  date: string
  service: string
  success: boolean
  message: string
  details?: string
}

export function Dashboard() {
  const [testResults, setTestResults] = useState<TestResult[]>([])

  useEffect(() => {
    // In a real app, you'd fetch this data from your backend
    const mockResults: TestResult[] = [
      {
        id: '1',
        date: '2023-06-01',
        service: 'YouTube Data API',
        success: true,
        message: 'Successfully retrieved channel data',
        details: 'Channel ID: UC...',
      },
      {
        id: '2',
        date: '2023-06-02',
        service: 'Google Drive API',
        success: false,
        message: 'Failed to create file',
        details: 'Error: Insufficient permissions',
      },
      // Add more mock results as needed
    ]
    setTestResults(mockResults)
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Test History</CardTitle>
      </CardHeader>
      <CardContent>
        {testResults.map((result) => (
          <Accordion type="single" collapsible key={result.id} className="mb-4">
            <AccordionItem value={result.id}>
              <AccordionTrigger>
                <div className="flex items-center justify-between w-full">
                  <span>{result.date} - {result.service}</span>
                  <Badge variant={result.success ? 'default' : 'destructive'}>
                    {result.success ? 'Success' : 'Failure'}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">{result.message}</p>
                {result.details && (
                  <pre className="bg-muted p-2 rounded text-sm">{result.details}</pre>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </CardContent>
    </Card>
  )
}

