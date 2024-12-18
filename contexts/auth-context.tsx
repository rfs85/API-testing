"use client"

import { createContext, useContext, ReactNode, useState } from 'react'

interface User {
  name?: string
  email?: string
  image?: string
}

interface AuthContext {
  user: User | null
  login: () => void
  logout: () => void
  updateUserProfile: (profile: { name: string; email: string }) => Promise<void>
}

const AuthContext = createContext<AuthContext>({
  user: null,
  login: () => {},
  logout: () => {},
  updateUserProfile: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = () => {
    // Implement login logic
  }

  const logout = () => {
    // Implement logout logic
    setUser(null)
  }

  const updateUserProfile = async (profile: { name: string; email: string }) => {
    // Implement profile update logic
    if (user) {
      setUser({ ...user, ...profile })
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
