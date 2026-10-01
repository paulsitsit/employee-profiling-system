import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit,
  Archive,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  User,
  Heart,
  Download
} from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import ConfirmDialog from '../components/ConfirmDialog'

const ViewEmployee = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    employeeId: null,
    employeeName: ''
  })

  useEffect(() => {
    fetchEmployee()
  }, [id])

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`/api/employees/${id}`)
      setEmployee(response.data)
    } catch (error) {
      toast.error('Failed to load employee data')
      navigate('/employees')
    } finally {
      setLoading(false)
    }
  }

  const handleArchive = async () => {
    try {
      await axios.post(`/api/employees/${id}/archive`)
      toast.success('Employee archived successfully')
      navigate('/employees')
    } catch (error) {
      toast.error('Failed to archive employee')
    }
    setConfirmDialog({ isOpen: false, employeeId: null, employeeName: '' })
  }

  const openArchiveDialog = () => {
    setConfirmDialog({
      isOpen: true,
      employeeId: id,
      employeeName: `${employee?.firstName} ${employee?.lastName}`
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A'
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!employee) return null

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/employees')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employee Profile</h1>
            <p className="text-gray-600 mt-1">View employee details</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/employees/edit/${id}`)}
            className="bg-primary-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-900 transition-colors flex items-center gap-2"
          >
            <Edit size={20} />
            Edit
          </button>
          <button
            onClick={openArchiveDialog}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Archive size={20} />
            Archive
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-800 to-primary-900 h-32"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 gap-4">
            <div className="relative">
              {employee.profilePhoto ? (
                <img
                  src={`http://localhost:5000${employee.profilePhoto}`}
                  alt={employee.firstName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center border-4 border-white shadow-lg">
                  <User size={64} className="text-primary-800" />
                </div>
              )}
            </div>
            <div className="flex-1 pt-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-800">
                  {employee.firstName} {employee.middleName && `${employee.middleName} `}{employee.lastName}
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  employee.employmentStatus === 'Regular'
                    ? 'bg-green-100 text-green-800'
                    : employee.employmentStatus === 'Probationary'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {employee.employmentStatus}
                </span>
              </div>
              <p className="text-gray-600 mt-1">{employee.position} • {employee.department}</p>
              <p className="text-gray-500 text-sm mt-1">Employee ID: {employee.employeeId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary-100 rounded-lg">
              <User size={24} className="text-primary-800" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium text-gray-800">
                {employee.firstName} {employee.middleName && `${employee.middleName} `}{employee.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium text-gray-800">{employee.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Birth Date</p>
              <p className="font-medium text-gray-800">{formatDate(employee.birthDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Age</p>
              <p className="font-medium text-gray-800">{calculateAge(employee.birthDate)} years old</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Civil Status</p>
              <p className="font-medium text-gray-800">{employee.civilStatus}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <Phone size={24} className="text-green-800" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <a href={`mailto:${employee.email}`} className="font-medium text-primary-800 hover:underline">
                {employee.email}
              </a>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact Number</p>
              <a href={`tel:${employee.contactNumber}`} className="font-medium text-primary-800 hover:underline">
                {employee.contactNumber}
              </a>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium text-gray-800">{employee.address}</p>
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase size={24} className="text-blue-800" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Employment Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="font-medium text-gray-800">{employee.employeeId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium text-gray-800">{employee.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Position</p>
              <p className="font-medium text-gray-800">{employee.position}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date Hired</p>
              <p className="font-medium text-gray-800">{formatDate(employee.dateHired)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Employment Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                employee.employmentStatus === 'Regular'
                  ? 'bg-green-100 text-green-800'
                  : employee.employmentStatus === 'Probationary'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {employee.employmentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 rounded-lg">
              <Heart size={24} className="text-red-800" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Emergency Contact</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Contact Name</p>
              <p className="font-medium text-gray-800">{employee.emergencyContact?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Relationship</p>
              <p className="font-medium text-gray-800">{employee.emergencyContact?.relationship}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact Phone</p>
              <a href={`tel:${employee.emergencyContact?.phone}`} className="font-medium text-primary-800 hover:underline">
                {employee.emergencyContact?.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar size={24} className="text-purple-800" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Account Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium text-gray-800">{formatDate(employee.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium text-gray-800">{formatDate(employee.updatedAt)}</p>
            </div>
            {employee.isArchived && (
              <div>
                <p className="text-sm text-gray-500">Archived At</p>
                <p className="font-medium text-red-800">{formatDate(employee.archivedAt)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Archive Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, employeeId: null, employeeName: '' })}
        onConfirm={handleArchive}
        title="Archive Employee"
        message={`Are you sure you want to archive ${employee.firstName} ${employee.lastName}? This will move them to archived records.`}
        confirmText="Archive"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  )
}

export default ViewEmployee