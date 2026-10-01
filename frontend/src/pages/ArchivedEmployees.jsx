import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  Archive,
  Eye,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Users,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react'
import axios from '../utils/axios'
import { toast } from 'react-toastify'
import EmptyState from '../components/EmptyState'
import { getPhotoUrl } from '../utils/apiUrl'

const ArchivedEmployees = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchEmployees()
  }, [currentPage, search])

  const fetchEmployees = async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        search,
        isArchived: 'true'
      })

      const response = await axios.get(`/api/employees?${params}`)

      setEmployees(response.data.employees)
      setTotalPages(response.data.totalPages)
      setTotal(response.data.total)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load archived employees')
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (id, name) => {
    try {
      await axios.post(`/api/employees/${id}/restore`)
      toast.success(`${name} restored successfully`)

      if (employees.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1)
      } else {
        fetchEmployees()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to restore employee')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'

    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleSearch = (event) => {
    event.preventDefault()
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 transition-colors hover:text-primary-800"
        >
          <LayoutDashboard size={16} />
          Dashboard
        </Link>
        <span>/</span>
        <Link
          to="/employees"
          className="transition-colors hover:text-primary-800"
        >
          Employees
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-700">Archived Records</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Link
            to="/employees"
            title="Back to Employees"
            className="mt-1 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition-colors hover:bg-gray-100 hover:text-primary-800"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Archived Records</h1>
            <p className="mt-1 text-gray-600">
              Former employees and archived records
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-200 bg-white px-5 py-3 font-medium text-primary-800 transition-colors hover:bg-primary-50"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            to="/employees"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-800 px-5 py-3 font-medium text-white transition-colors hover:bg-primary-900"
          >
            <Users size={20} />
            Active Employees
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search archived employees by name, ID, department, or position..."
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary-800"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-800 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-900"
          >
            <Filter size={20} />
            Search
          </button>
        </form>
      </div>

      {/* Archived Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 p-6">
          <div className="rounded-lg bg-red-100 p-3">
            <Archive size={24} className="text-red-800" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Archived Employees
            </h3>
            <p className="text-sm text-gray-500">
              {total} archived record{total === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-800" />
          </div>
        ) : employees.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Employee ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Archived Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {employees.map((employee) => (
                    <tr
                      key={employee._id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <Link
                          to={`/employees/view/${employee._id}`}
                          className="flex items-center gap-3"
                        >
                          {employee.profilePhoto ? (
                            <img
                              src={getPhotoUrl(employee.profilePhoto)}
                              alt={`${employee.firstName} ${employee.lastName}`}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-600">
                              {employee.firstName.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div>
                            <p className="font-medium text-gray-800">
                              {employee.firstName} {employee.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{employee.email}</p>
                          </div>
                        </Link>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                          {employee.employeeId}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {employee.department}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {employee.position}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {formatDate(employee.archivedAt)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/employees/view/${employee._id}`}
                            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
                            title="View employee"
                          >
                            <Eye size={18} />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleRestore(
                                employee._id,
                                `${employee.firstName} ${employee.lastName}`
                              )
                            }
                            className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-50"
                            title="Restore employee"
                          >
                            <RotateCcw size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">
                Showing{' '}
                <span className="font-medium">
                  {total === 0 ? 0 : (currentPage - 1) * 10 + 1}
                </span>{' '}
                to <span className="font-medium">{Math.min(currentPage * 10, total)}</span>{' '}
                of <span className="font-medium">{total}</span> results
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-300 p-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Previous page"
                >
                  <ChevronLeft size={20} />
                </button>

                <span className="rounded-lg bg-primary-800 px-4 py-2 font-medium text-white">
                  {currentPage} / {Math.max(totalPages, 1)}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(page + 1, Math.max(totalPages, 1))
                    )
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="rounded-lg border border-gray-300 p-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Next page"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            icon={Archive}
            title="No archived employees"
            message={
              search
                ? 'No archived employees match your search.'
                : 'Employees you archive will appear here.'
            }
          />
        )}
      </div>
    </div>
  )
}

export default ArchivedEmployees