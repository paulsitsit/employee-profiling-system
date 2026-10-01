import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import AddEmployee from './pages/AddEmployee'
import EditEmployee from './pages/EditEmployee'
import ViewEmployee from './pages/ViewEmployee'
import ArchivedEmployees from './pages/ArchivedEmployees'

const AppRoutes = () => {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Only administrators can sign in */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Every dashboard route requires an authenticated administrator */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/add" element={<AddEmployee />} />
        <Route path="/employees/edit/:id" element={<EditEmployee />} />
        <Route path="/employees/view/:id" element={<ViewEmployee />} />
        <Route path="/employees/archived" element={<ArchivedEmployees />} />
      </Route>

      {/* Redirect any invalid URL correctly */}
      <Route
        path="*"
        element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App