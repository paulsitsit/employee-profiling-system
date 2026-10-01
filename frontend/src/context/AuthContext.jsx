import { createContext, useContext, useEffect, useState } from 'react'
import axios from '../utils/axios'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const restoreSession = () => {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (!token || !storedUser) {
        setLoading(false)
        return
      }

      try {
        const parsedUser = JSON.parse(storedUser)

        // Admin-only system: remove any old employee session.
        if (parsedUser.role !== 'admin') {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          delete axios.defaults.headers.common.Authorization
          setUser(null)
          return
        }

        setUser(parsedUser)
        axios.defaults.headers.common.Authorization = `Bearer ${token}`
      } catch (error) {
        console.error('Could not restore saved session:', error)

        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete axios.defaults.headers.common.Authorization
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  const saveSession = (responseData) => {
    const { token, ...userData } = responseData

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    axios.defaults.headers.common.Authorization = `Bearer ${token}`

    setUser(userData)
  }

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', {
      email,
      password
    })

    // Extra frontend validation. Backend is the real security enforcement.
    if (response.data.role !== 'admin') {
      throw new Error('Access denied. Administrator account required.')
    }

    saveSession(response.data)

    return response.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common.Authorization
    setUser(null)
  }

  const updateUser = (updatedData) => {
    const token = localStorage.getItem('token')

    if (updatedData.role !== 'admin') {
      logout()
      return
    }

    localStorage.setItem('user', JSON.stringify(updatedData))

    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    }

    setUser(updatedData)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}