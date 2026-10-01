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
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ mobileSidebarOpen, setMobileSidebarOpen }) => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const isAdmin = user?.role === 'admin'

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      visible: true
    },
    {
      path: '/employees',
      icon: Users,
      label: 'Employees',
      visible: true
    },
    {
      path: '/employees/add',
      icon: UserPlus,
      label: 'Add Employee',
      visible: isAdmin
    },
    {
      path: '/employees/archived',
      icon: Archive,
      label: 'Archived Records',
      visible: isAdmin
    }
  ]

  const visibleMenuItems = menuItems.filter((item) => item.visible)

  const isActive = (path) => {
    if (path === '/employees') {
      return (
        location.pathname === '/employees' ||
        location.pathname.startsWith('/employees/view') ||
        location.pathname.startsWith('/employees/edit')
      )
    }

    return location.pathname === path
  }

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false)
  }

  const handleLogout = () => {
    closeMobileSidebar()
    logout()
  }

  return (
    <>
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <button
          type="button"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          aria-label="Close navigation menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-primary-800 text-white transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b border-primary-700 px-4">
          {!collapsed && (
            <Link
              to="/dashboard"
              onClick={closeMobileSidebar}
              className="truncate text-lg font-bold"
            >
              HR Admin
            </Link>
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden rounded p-1 transition-colors hover:bg-primary-700 lg:inline-flex"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            <button
              type="button"
              onClick={closeMobileSidebar}
              className="rounded p-1 transition-colors hover:bg-primary-700 lg:hidden"
              aria-label="Close navigation menu"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto py-4">
          {visibleMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMobileSidebar}
              title={collapsed ? item.label : undefined}
              className={`mx-2 flex items-center rounded-lg px-4 py-3 transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-primary-700 hover:text-white'
              }`}
            >
              <item.icon size={20} className="shrink-0" />

              {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Current user */}
        {user && !collapsed && (
          <div className="border-t border-primary-700 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600 font-semibold">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="text-xs capitalize text-gray-400">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="border-t border-primary-700 p-2">
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-gray-300 transition-colors hover:bg-primary-700 hover:text-white"
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar