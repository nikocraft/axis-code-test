import { createContext, useState, useContext, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  getAuthToken: () => string | null
  saveAuthToken: (token: string) => void
  deleteAuthToken: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
      setIsAuthenticated(!!token)
  }, [])

  const getAuthToken = () => {
    return localStorage.getItem('token')
  }

  const saveAuthToken = (token: string) => {
    localStorage.setItem('token', token)
    setIsAuthenticated(true)
  }

  const deleteAuthToken = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, getAuthToken, saveAuthToken, deleteAuthToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}