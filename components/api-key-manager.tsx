"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trash2 } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key: string
  projectId: string
}

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [newKeyName, setNewKeyName] = useState('')
  const [newApiKey, setNewApiKey] = useState('')
  const [newProjectId, setNewProjectId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/api-keys')
      if (!response.ok) throw new Error('Failed to fetch API keys')
      const data = await response.json()
      setApiKeys(data)
    } catch (error) {
      console.error('Error fetching API keys:', error)
      toast({
        title: 'Error',
        description: 'Failed to load API keys. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddKey = async () => {
    if (newKeyName && newApiKey && newProjectId) {
      try {
        const response = await fetch('/api/api-keys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newKeyName, key: newApiKey, projectId: newProjectId }),
        })
        if (!response.ok) throw new Error('Failed to add API key')
        const newKey = await response.json()
        setApiKeys([...apiKeys, newKey])
        setNewKeyName('')
        setNewApiKey('')
        setNewProjectId('')
        toast({
          title: 'API Key Added',
          description: `${newKeyName} has been added successfully.`,
        })
      } catch (error) {
        console.error('Error adding API key:', error)
        toast({
          title: 'Error',
          description: 'Failed to add API key. Please try again.',
          variant: 'destructive',
        })
      }
    } else {
      toast({
        title: 'Invalid Input',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteKey = async (id: string) => {
    try {
      const response = await fetch(`/api/api-keys/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete API key')
      setApiKeys(apiKeys.filter(key => key.id !== id))
      toast({
        title: 'API Key Deleted',
        description: 'The API key has been removed.',
      })
    } catch (error) {
      console.error('Error deleting API key:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete API key. Please try again.',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return <div>Loading API Keys...</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="keyName">Key Name</Label>
          <Input
            id="keyName"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="My API Key"
          />
        </div>
        <div>
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            value={newApiKey}
            onChange={(e) => setNewApiKey(e.target.value)}
            placeholder="Your Google API Key"
            type="password"
          />
        </div>
        <div>
          <Label htmlFor="projectId">Project ID</Label>
          <Input
            id="projectId"
            value={newProjectId}
            onChange={(e) => setNewProjectId(e.target.value)}
            placeholder="Your Google Cloud Project ID"
          />
        </div>
      </div>
      <Button onClick={handleAddKey}>Add API Key</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>API Key</TableHead>
            <TableHead>Project ID</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((key) => (
            <TableRow key={key.id}>
              <TableCell>{key.name}</TableCell>
              <TableCell>••••••••••{key.key.slice(-4)}</TableCell>
              <TableCell>{key.projectId}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteKey(key.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete API Key</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

