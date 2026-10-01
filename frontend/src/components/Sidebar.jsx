import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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

const Sidebar = ({
  mobileSidebarOpen = false,
  setMobileSidebarOpen = () => {}
}) => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isAdmin = user?.role === 'admin'

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      visible: true
    },
    {
      path: '/employees',
      label: 'Employees',
      icon: Users,
      visible: true
    },
    {
      path: '/employees/add',
      label: 'Add Employee',
      icon: UserPlus,
      visible: isAdmin
    },
    {
      path: '/employees/archived',
      label: 'Archived Records',
      icon: Archive,
      visible: isAdmin
    }
  ]

  const closeSidebar = () => {
    setMobileSidebarOpen(false)
  }

  const handleLogout = () => {
    logout()
    closeSidebar()
    navigate('/login', { replace: true })
  }

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

  return (
    <>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <button
          type="button"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col',
          'bg-primary-800 text-white shadow-xl',
          'transition-transform duration-300',
          'lg:translate-x-0',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-primary-700 px-4">
          {!collapsed && (
            <Link
              to="/dashboard"
              onClick={closeSidebar}
              className="truncate text-lg font-bold"
            >
              HR Admin
            </Link>
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="hidden rounded-lg p-2 transition-colors hover:bg-primary-700 lg:inline-flex"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>

            <button
              type="button"
              onClick={closeSidebar}
              className="rounded-lg p-2 transition-colors hover:bg-primary-700 lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable navigation */}
        <nav className="min-h-0 flex-1 overflow-y-auto py-4">
          <div className="space-y-1">
            {menuItems
              .filter((item) => item.visible)
              .map((item) => {
                const Icon = item.icon

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeSidebar}
                    title={collapsed ? item.label : undefined}
                    className={[
                      'mx-2 flex items-center rounded-lg px-4 py-3 transition-colors',
                      isActive(item.path)
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-primary-700 hover:text-white',
                      collapsed ? 'justify-center' : ''
                    ].join(' ')}
                  >
                    <Icon size={21} className="shrink-0" />

                    {!collapsed && (
                      <span className="ml-3 truncate">{item.label}</span>
                    )}
                  </Link>
                )
              })}
          </div>
        </nav>

        {/* User profile */}
        {user && (
          <div className="shrink-0 border-t border-primary-700 p-3">
            <div
              className={[
                'flex items-center',
                collapsed ? 'justify-center' : 'gap-3'
              ].join(' ')}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600 font-semibold">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>

              {!collapsed && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="text-xs capitalize text-gray-400">
                    {user.role || 'employee'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Persistent logout */}
        <div className="shrink-0 border-t border-primary-700 p-3">
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className={[
              'flex w-full items-center rounded-lg px-4 py-3',
              'font-medium text-gray-200 transition-colors',
              'hover:bg-red-600 hover:text-white',
              collapsed ? 'justify-center' : 'gap-3'
            ].join(' ')}
          >
            <LogOut size={21} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar