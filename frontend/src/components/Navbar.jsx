import { Bell, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth()

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-gray-800 sm:text-xl">
            Employee Profiling System
          </h2>

          <p className="hidden text-xs text-gray-500 sm:block">
            {currentDate}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          className="relative rounded-full p-2 transition-colors hover:bg-gray-100"
          title="Notifications"
        >
          <Bell size={20} className="text-gray-600" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-3 sm:pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-800 text-sm font-semibold text-white sm:h-10 sm:w-10">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="hidden md:block">
            <p className="max-w-36 truncate text-sm font-medium text-gray-700">
              {user?.name || 'User'}
            </p>
            <p className="text-xs capitalize text-gray-500">
              {user?.role || 'employee'}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar