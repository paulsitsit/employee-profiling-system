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
  Users
} from 'lucide-react'
import axios from '../utils/axios'
import { toast } from 'react-toastify'
import EmptyState from '../components/EmptyState'

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
      toast.error('Failed to load archived employees')
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (id, name) => {
    try {
      await axios.post(`/api/employees/${id}/restore`)
      toast.success(`${name} restored successfully`)
      fetchEmployees()
    } catch (error) {
      toast.error('Failed to restore employee')
    }
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
          <h1 className="text-2xl font-bold text-gray-800">Archived Records</h1>
          <p className="text-gray-600 mt-1">Former employees and archived records</p>
        </div>
        <Link
          to="/employees"
          className="bg-primary-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-900 transition-colors flex items-center gap-2"
        >
          <Users size={20} />
          View Active Employees
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); fetchEmployees() }} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search archived employees..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-primary-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-900 transition-colors flex items-center gap-2"
          >
            <Filter size={20} />
            Search
          </button>
        </form>
      </div>

      {/* Archived Employees Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-lg">
            <Archive size={24} className="text-red-800" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Archived Employees</h3>
            <p className="text-sm text-gray-500">{total} archived records</p>
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
                      Archived Date
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
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold">
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
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {formatDate(employee.archivedAt)}
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
                          <button
                            onClick={() => handleRestore(employee._id, `${employee.firstName} ${employee.lastName}`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Restore"
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
            icon={Archive}
            title="No archived employees"
            message={search ? "No archived employees match your search" : "Archived employees will appear here"}
          />
        )}
      </div>
    </div>
  )
}

export default ArchivedEmployees