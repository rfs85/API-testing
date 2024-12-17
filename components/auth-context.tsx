"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'

interface AuthContextType {
  session: Session | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  status: 'loading'
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  // Provide a default value when session is undefined
  const contextValue: AuthContextType = {
    session: session ?? null,
    status: status ?? 'loading'
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

