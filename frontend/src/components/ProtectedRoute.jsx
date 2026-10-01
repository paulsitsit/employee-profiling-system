import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

const ProtectedRoute = ({ children }) => {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Loader />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Clear saved sessions belonging to old employee accounts.
  if (user.role !== 'admin') {
    logout()
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute