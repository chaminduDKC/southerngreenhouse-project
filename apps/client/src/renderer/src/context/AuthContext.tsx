import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { api } from '../api/apiClient'
import { registerLogoutHandler } from './authEvents'

interface User {
  id: string
  email: string
}

interface AuthContextType {
  token: string | null
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'sg_token'
const USER_KEY = 'sg_user'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const tokenRef = useRef<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    const savedUser = localStorage.getItem(USER_KEY)
    if (savedToken && savedUser) {
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]!))
        if (payload.exp && payload.exp * 1000 > Date.now()) {
          setToken(savedToken)
          tokenRef.current = savedToken
          setUser(JSON.parse(savedUser))
        } else {
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const clearAuthState = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    tokenRef.current = null
    setUser(null)
  }

  // Let apiClient's 401 interceptor trigger a *real* logout (updates React state,
  // not just localStorage) so the route guard in App.tsx actually re-renders to /login.
  useEffect(() => {
    registerLogoutHandler(clearAuthState)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    const { accessToken, user: userData } = res.data.data
    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setToken(accessToken)
    tokenRef.current = accessToken
    setUser(userData)
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // ignore — token may already be expired
    }
    clearAuthState()
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY)