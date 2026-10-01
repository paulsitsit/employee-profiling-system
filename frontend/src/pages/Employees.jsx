import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit,
  Archive,
  ChevronLeft,
  ChevronRight,
  Users,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react'
import axios from '../utils/axios'
import { toast } from 'react-toastify'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [departments, setDepartments] = useState([])
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    employeeId: null,
    employeeName: ''
  })

  useEffect(() => {
    fetchDepartments()
  }, [])

  useEffect(() => {
    fetchEmployees()
  }, [currentPage, search, department])

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/employees/departments')
      setDepartments(response.data)
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const fetchEmployees = async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        search,
        department,
        isArchived: 'false'
      })

      const response = await axios.get(`/api/employees?${params}`)

      setEmployees(response.data.employees)
      setTotalPages(response.data.totalPages)
      setTotal(response.data.total)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (event) => {
    event.preventDefault()
    setCurrentPage(1)
  }

  const handleArchive = async () => {
    try {
      await axios.post(`/api/employees/${confirmDialog.employeeId}/archive`)
      toast.success('Employee archived successfully')
      fetchEmployees()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to archive employee')
    } finally {
      setConfirmDialog({
        isOpen: false,
        employeeId: null,
        employeeName: ''
      })
    }
  }

  const openArchiveDialog = (employee) => {
    setConfirmDialog({
      isOpen: true,
      employeeId: employee._id,
      employeeName: `${employee.firstName} ${employee.lastName}`
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'

    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 hover:text-primary-800 transition-colors"
        >
          <LayoutDashboard size={16} />
          Dashboard
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-700">Employees</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Link
            to="/dashboard"
            title="Back to Dashboard"
            className="mt-1 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition-colors hover:bg-gray-100 hover:text-primary-800"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
            <p className="mt-1 text-gray-600">Manage your employee records</p>
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
            to="/employees/add"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-800 px-5 py-3 font-medium text-white transition-colors hover:bg-primary-900"
          >
            <UserPlus size={20} />
            Add Employee
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
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
              placeholder="Search by name, ID, email, department, or position..."
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary-800"
            />
          </div>

          <select
            value={department}
            onChange={(event) => {
              setDepartment(event.target.value)
              setCurrentPage(1)
            }}
            className="min-w-[200px] rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary-800"
          >
            <option value="">All Departments</option>
            {departments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-800 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-900"
          >
            <Filter size={20} />
            Filter
          </button>
        </form>
      </div>

      {/* Employees Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary-100 p-3">
              <Users size={24} className="text-primary-800" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Employee List</h3>
              <p className="text-sm text-gray-500">{total} total employees</p>
            </div>
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date Hired
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {employees.map((employee) => (
                    <tr key={employee._id} className="transition-colors hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <Link
                          to={`/employees/view/${employee._id}`}
                          className="flex items-center gap-3"
                        >
                          {employee.profilePhoto ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL}${employee.profilePhoto}`}
                              alt={`${employee.firstName} ${employee.lastName}`}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-800">
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

                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            employee.employmentStatus === 'Regular'
                              ? 'bg-green-100 text-green-800'
                              : employee.employmentStatus === 'Probationary'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {employee.employmentStatus}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {formatDate(employee.dateHired)}
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

                          <Link
                            to={`/employees/edit/${employee._id}`}
                            className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                            title="Edit employee"
                          >
                            <Edit size={18} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => openArchiveDialog(employee)}
                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                            title="Archive employee"
                          >
                            <Archive size={18} />
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
                    setCurrentPage((page) => Math.min(page + 1, Math.max(totalPages, 1)))
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
            icon={Users}
            title="No employees found"
            message={
              search || department
                ? 'Try adjusting your search or department filter.'
                : 'Get started by adding your first employee.'
            }
            action={
              !search &&
              !department && (
                <Link
                  to="/employees/add"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-800 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-900"
                >
                  <UserPlus size={20} />
                  Add Employee
                </Link>
              )
            }
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() =>
          setConfirmDialog({
            isOpen: false,
            employeeId: null,
            employeeName: ''
          })
        }
        onConfirm={handleArchive}
        title="Archive Employee"
        message={`Are you sure you want to archive ${confirmDialog.employeeName}? This will move them to archived records.`}
        confirmText="Archive"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  )
}

export default Employees