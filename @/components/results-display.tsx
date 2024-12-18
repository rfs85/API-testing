'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ResultsDisplay() {
  const [results, setResults] = useState<string | null>(null)

  // This component will be updated with the actual results from the API test
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Test Results</CardTitle>
      </CardHeader>
      <CardContent>
        {results ? (
          <pre className="whitespace-pre-wrap">{results}</pre>
        ) : (
          <p>No results yet. Test an API to see the results.</p>
        )}
      </CardContent>
    </Card>
  )
}

