import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from '../services/api'



export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const [token, setToken] = useState(
    () => localStorage.getItem('access_token'),
  )

  const [loading, setLoading] = useState(true)

  const isAuthenticated = Boolean(token && user)

  useEffect(() => {
    const loadCurrentUser = async () => {
      const storedToken = localStorage.getItem('access_token')

      if (!storedToken) {
        setLoading(false)
        return
      }

      try {
        const currentUser = await getCurrentUser()

        setToken(storedToken)
        setUser(currentUser)
      } catch (error) {
        console.error('Authentication check failed:', error)

        localStorage.removeItem('access_token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadCurrentUser()
  }, [])

  const login = async (credentials) => {
    const data = await loginUser(credentials)

    localStorage.setItem(
      'access_token',
      data.access_token,
    )

    setToken(data.access_token)

    const currentUser = await getCurrentUser()

    setUser(currentUser)

    return currentUser
  }

  const register = async (userData) => {
    return registerUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('access_token')

    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
