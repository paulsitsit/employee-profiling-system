import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  UserCheck,
  Archive,
  UserPlus,
  TrendingUp,
  Building2,
  Briefcase
} from 'lucide-react'
import axios from '../utils/axios'
import StatCard from '../components/StatCard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe']

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/employees/stats/dashboard')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div>
      </div>
    )
  }

  const departmentData = stats?.departmentStats?.map((dept, index) => ({
    name: dept._id,
    value: dept.count,
    fill: COLORS[index % COLORS.length]
  })) || []

  const statusData = stats?.statusStats?.map((status) => ({
    name: status._id,
    value: status.count
  })) || []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your employee database</p>
        </div>
        <Link
          to="/employees/add"
          className="bg-primary-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-900 transition-colors flex items-center gap-2"
        >
          <UserPlus size={20} />
          Add Employee
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={stats?.totalEmployees || 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Employees"
          value={stats?.totalEmployees - (stats?.archivedEmployees || 0) || 0}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Archived Records"
          value={stats?.archivedEmployees || 0}
          icon={Archive}
          color="red"
        />
        <StatCard
          title="New This Month"
          value={stats?.newHiresThisMonth || 0}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Building2 size={24} className="text-primary-800" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Department Distribution</h3>
              <p className="text-sm text-gray-500">Employees by department</p>
            </div>
          </div>
          {departmentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="value" fill="#1e40af" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No department data available
            </div>
          )}
        </div>

        {/* Employment Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <Briefcase size={24} className="text-green-800" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Employment Status</h3>
              <p className="text-sm text-gray-500">Breakdown by employment type</p>
            </div>
          </div>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No status data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Employees */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Users size={24} className="text-primary-800" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Recent Employees</h3>
                <p className="text-sm text-gray-500">Latest additions to the team</p>
              </div>
            </div>
            <Link
              to="/employees"
              className="text-primary-800 font-medium hover:underline text-sm"
            >
              View All →
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats?.recentEmployees?.length > 0 ? (
                stats.recentEmployees.map((employee) => (
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
                        <span className="font-medium text-gray-800">
                          {employee.firstName} {employee.lastName}
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {employee.employeeId}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No employees found. Add your first employee!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard