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
  Users
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
      toast.error('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchEmployees()
  }

  const handleArchive = async () => {
    try {
      await axios.post(`/api/employees/${confirmDialog.employeeId}/archive`)
      toast.success('Employee archived successfully')
      fetchEmployees()
    } catch (error) {
      toast.error('Failed to archive employee')
    }
    setConfirmDialog({ isOpen: false, employeeId: null, employeeName: '' })
  }

  const openArchiveDialog = (employee) => {
    setConfirmDialog({
      isOpen: true,
      employeeId: employee._id,
      employeeName: `${employee.firstName} ${employee.lastName}`
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
          <p className="text-gray-600 mt-1">Manage your employee records</p>
        </div>
        <Link
          to="/employees/add"
          className="bg-primary-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-900 transition-colors flex items-center gap-2"
        >
          <UserPlus size={20} />
          Add Employee
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, email, department, or position..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value)
              setCurrentPage(1)
            }}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent outline-none bg-white min-w-[200px]"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-primary-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-900 transition-colors flex items-center gap-2"
          >
            <Filter size={20} />
            Filter
          </button>
        </form>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Users size={24} className="text-primary-800" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Employee List</h3>
              <p className="text-sm text-gray-500">{total} total employees</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div>
          </div>
        ) : employees.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Hired
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employees.map((employee) => (
                    <tr key={employee._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/employees/view/${employee._id}`}
                          className="flex items-center gap-3"
                        >
                          {employee.profilePhoto ? (
                            <img
                              src={`http://localhost:5000${employee.profilePhoto}`}
                              alt={employee.firstName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-semibold">
                              {employee.firstName.charAt(0)}
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {employee.employeeId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {employee.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {employee.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          employee.employmentStatus === 'Regular'
                            ? 'bg-green-100 text-green-800'
                            : employee.employmentStatus === 'Probationary'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {employee.employmentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {formatDate(employee.dateHired)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/employees/view/${employee._id}`}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            to={`/employees/edit/${employee._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => openArchiveDialog(employee)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Archive"
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
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * 10, total)}</span> of{' '}
                <span className="font-medium">{total}</span> results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="px-4 py-2 bg-primary-800 text-white rounded-lg font-medium">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            message={search || department ? "Try adjusting your search or filters" : "Get started by adding your first employee"}
            action={
              !search && !department && (
                <Link
                  to="/employees/add"
                  className="bg-primary-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-900 transition-colors inline-flex items-center gap-2"
                >
                  <UserPlus size={20} />
                  Add Employee
                </Link>
              )
            }
          />
        )}
      </div>

      {/* Confirm Archive Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, employeeId: null, employeeName: '' })}
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