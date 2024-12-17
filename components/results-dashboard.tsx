"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useToast } from '@/components/ui/use-toast'

interface TestResult {
  _id: string
  createdAt: string
  service: string
  success: boolean
  message: string
  details?: string
}

export function ResultsDashboard() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const response = await fetch('/api/test-results')
        if (!response.ok) {
          throw new Error('Failed to fetch test results')
        }
        const data = await response.json()
        setTestResults(data)
      } catch (error) {
        console.error('Error fetching test results:', error)
        toast({
          title: 'Error',
          description: 'Failed to load test results. Please try again later.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestResults()
  }, [toast])

  const chartData = testResults.reduce((acc, result) => {
    const existingService = acc.find(item => item.service === result.service)
    if (existingService) {
      existingService.total += 1
      if (result.success) existingService.successful += 1
    } else {
      acc.push({
        service: result.service,
        total: 1,
        successful: result.success ? 1 : 0,
      })
    }
    return acc
  }, [] as { service: string; total: number; successful: number }[])

  if (isLoading) {
    return <div>Loading test results...</div>
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Test Results Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="service" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#8884d8" name="Total Tests" />
              <Bar dataKey="successful" fill="#82ca9d" name="Successful Tests" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          {testResults.map((result) => (
            <Accordion type="single" collapsible key={result._id} className="mb-4">
              <AccordionItem value={result._id}>
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full">
                    <span>{new Date(result.createdAt).toLocaleString()} - {result.service}</span>
                    <Badge variant={result.success ? 'default' : 'destructive'}>
                      {result.success ? 'Success' : 'Failure'}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">{result.message}</p>
                  {result.details && (
                    <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">{result.details}</pre>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

