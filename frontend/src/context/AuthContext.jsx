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

        setUser(parsedUser)
        axios.defaults.headers.common.Authorization = `Bearer ${token}`
      } catch (error) {
        console.error('Could not restore saved user session:', error)

        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete axios.defaults.headers.common.Authorization
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

    saveSession(response.data)

    return response.data
  }

  const register = async (name, email, password) => {
    // The backend assigns every publicly registered account the employee role.
    const response = await axios.post('/api/auth/register', {
      name,
      email,
      password
    })

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
    const currentToken = localStorage.getItem('token')

    localStorage.setItem('user', JSON.stringify(updatedData))

    if (currentToken) {
      axios.defaults.headers.common.Authorization = `Bearer ${currentToken}`
    }

    setUser(updatedData)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}