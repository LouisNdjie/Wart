// hooks/useAuth.ts
import { createContext, useContext } from 'react'
import type { User } from '../types'

export type AuthContextType = {
  user: User | null
  isLoggedIn: boolean
  isAdmin: boolean
  loading: boolean
  setUser: (user: User | null) => void
  logout: () => void
  initials: string
}

export const AuthContext = createContext<AuthContextType | null>(null)

export default function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth: AuthProvider manquant')
  }
  
  return context
}
