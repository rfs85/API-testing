'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/use-toast'

const apiServices = [
  { name: 'Google', fields: ['API Key', 'Project ID'] },
  { name: 'Azure', fields: ['API Key', 'Subscription ID'] },
]

export default function ApiTestingForm() {
  const [selectedService, setSelectedService] = useState('')
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/test-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ service: selectedService, ...formData }),
      })

      if (!response.ok) {
        throw new Error('API test failed')
      }

      const data = await response.json()
      toast({
        title: 'API Test Successful',
        description: data.result,
      })
    } catch (error) {
      console.error('API test error:', error)
      toast({
        title: 'API Test Failed',
        description: 'An error occurred while testing the API',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div>
        <Label htmlFor="api-service">Select API Service</Label>
        <Select onValueChange={(value) => setSelectedService(value)}>
          <SelectTrigger id="api-service">
            <SelectValue placeholder="Select an API service" />
          </SelectTrigger>
          <SelectContent>
            {apiServices.map((service) => (
              <SelectItem key={service.name} value={service.name}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedService && (
        <div className="space-y-4">
          {apiServices
            .find((service) => service.name === selectedService)
            ?.fields.map((field) => (
              <div key={field}>
                <Label htmlFor={field}>{field}</Label>
                <Input
                  id={field}
                  type="text"
                  value={formData[field] || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  required
                />
              </div>
            ))}
        </div>
      )}

      <Button type="submit" disabled={!selectedService || isLoading}>
        {isLoading ? 'Testing...' : 'Test API'}
      </Button>
    </form>
  )
}

