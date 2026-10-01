import { Navigate, Outlet } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

const AdminRoute = () => {
  const { user, loading } = useAuth()

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

  if (user.role !== 'admin') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <ShieldAlert size={28} className="text-red-600" />
          </div>

          <h1 className="text-xl font-bold text-gray-800">
            Administrator Access Required
          </h1>

          <p className="mt-2 text-gray-600">
            Your employee account does not have permission to access this page.
          </p>

          <a
            href="/dashboard"
            className="mt-6 inline-flex rounded-lg bg-primary-800 px-5 py-3 font-medium text-white transition-colors hover:bg-primary-900"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return <Outlet />
}

export default AdminRoute