import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Archive,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/employees', icon: Users, label: 'Employees' },
    { path: '/employees/add', icon: UserPlus, label: 'Add Employee' },
    { path: '/employees/archived', icon: Archive, label: 'Archived Records' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-primary-800 text-white transition-all duration-300 flex flex-col`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-primary-700">
        {!collapsed && (
          <h1 className="text-lg font-bold truncate">HR Admin</h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-primary-700 rounded transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 mx-2 mb-1 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-primary-600 text-white'
                : 'text-gray-300 hover:bg-primary-700 hover:text-white'
            }`}
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!collapsed && (
              <span className="ml-3 truncate">{item.label}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* User Info */}
      {user && !collapsed && (
        <div className="px-4 py-3 border-t border-primary-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="p-2 border-t border-primary-700">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-300 hover:bg-primary-700 hover:text-white rounded-lg transition-colors"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar