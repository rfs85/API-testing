"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { useToast } from 'components/ui/use-toast'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const result = await signIn('google', { callbackUrl: '/' })
      if (result?.error) {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred during login. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to access the Google API Testing Suite</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleLogin} disabled={isLoading} className="w-full">
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardFooter>
    </Card>
  )
}

