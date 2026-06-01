// context/AuthProvider.tsx
import { useState, useEffect, type ReactNode } from 'react'
import { getMe, logout as apiLogout } from '../api/client'
import { AuthContext } from '../hooks/useAuth'
import type { User } from '../types'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(() => !!localStorage.getItem('wart_token'))

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('wart_token')
      if (!token) return

      try {
        const currentUser = await getMe()
        setUser(currentUser as User)
      } catch (err) {
        console.error('Erreur session:', err)
        localStorage.removeItem('wart_token')
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const logout = () => {
    apiLogout()
    setUser(null)
  }

  // Extraction des initiale 
  const initials = user?.username
    ? user.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'SE'

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        setUser,
        logout,
        initials,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
