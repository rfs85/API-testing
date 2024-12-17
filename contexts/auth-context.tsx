"use client"

import { createContext, useContext, ReactNode } from 'react'

interface User {
  name?: string
  email?: string
  image?: string
}

interface AuthContext {
  user: User | null
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContext>({
  user: null,
  login: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Implement your auth logic here
  return (
    <AuthContext.Provider value={{ user: null, login: () => {}, logout: () => {} }}>
      {children}
    </AuthContext.Provider>
  )
} 