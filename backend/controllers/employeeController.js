import Employee from '../models/Employee.js'

const buildEmployeeSearchQuery = ({
  search,
  department,
  position,
  employmentStatus,
  isArchived
}) => {
  const query = {
    isArchived: isArchived === 'true'
  }

  const safeSearch = typeof search === 'string' ? search.trim() : ''

  if (safeSearch) {
    query.$or = [
      { employeeId: { $regex: safeSearch, $options: 'i' } },
      { firstName: { $regex: safeSearch, $options: 'i' } },
      { middleName: { $regex: safeSearch, $options: 'i' } },
      { lastName: { $regex: safeSearch, $options: 'i' } },
      { email: { $regex: safeSearch, $options: 'i' } },
      { department: { $regex: safeSearch, $options: 'i' } },
      { position: { $regex: safeSearch, $options: 'i' } }
    ]
  }

  if (typeof department === 'string' && department.trim()) {
    query.department = {
      $regex: department.trim(),
      $options: 'i'
    }
  }

  if (typeof position === 'string' && position.trim()) {
    query.position = {
      $regex: position.trim(),
      $options: 'i'
    }
  }

  if (typeof employmentStatus === 'string' && employmentStatus.trim()) {
    query.employmentStatus = employmentStatus.trim()
  }

  return query
}

const normalizePage = (value) => {
  const parsed = Number.parseInt(value, 10)

  if (Number.isNaN(parsed) || parsed < 1) {
    return 1
  }

  return parsed
}

const normalizeLimit = (value) => {
  const parsed = Number.parseInt(value, 10)

  if (Number.isNaN(parsed) || parsed < 1) {
    return 10
  }

  return Math.min(parsed, 100)
}

// @desc    Get all employees with search, filters, and pagination
// @route   GET /api/employees
// @access  Private
export const getEmployees = async (req, res) => {
  try {
    const page = normalizePage(req.query.page)
    const limit = normalizeLimit(req.query.limit)

    const query = buildEmployeeSearchQuery({
      search: req.query.search,
      department: req.query.department,
      position: req.query.position,
      employmentStatus: req.query.employmentStatus,
      isArchived: req.query.isArchived
    })

    const skip = (page - 1) * limit

    const [employees, total] = await Promise.all([
      Employee.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Employee.countDocuments(query)
    ])

    return res.status(200).json({
      employees,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      total,
      hasMore: page * limit < total
    })
  } catch (error) {
    console.error('Get Employees Error:', error)

    return res.status(500).json({
      message: 'Unable to load employees',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// @desc    Get one employee by MongoDB ID
// @route   GET /api/employees/:id
// @access  Private
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)

    if (!employee) {
      return res.status(404).json({
        message: 'Employee not found'
      })
    }

    return res.json(employee)
  } catch (error) {
    console.error('Get Employee Error:', error)

    return res.status(500).json({
      message: 'Unable to load employee'
    })
  }
}

// @desc    Get one employee by employee ID, e.g. EMP00001
// @route   GET /api/employees/by-id/:employeeId
// @access  Private
export const getEmployeeByEmployeeId = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      employeeId: req.params.employeeId
    })

    if (!employee) {
      return res.status(404).json({
        message: 'Employee not found'
      })
    }

    return res.json(employee)
  } catch (error) {
    console.error('Get Employee By Employee ID Error:', error)

    return res.status(500).json({
      message: 'Unable to load employee'
    })
  }
}

// @desc    Create employee
// @route   POST /api/employees
// @access  Private/Admin
export const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      gender,
      birthDate,
      civilStatus,
      address,
      contactNumber,
      email,
      department,
      position,
      dateHired,
      employmentStatus,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactPhone
    } = req.body

    const lastEmployee = await Employee.findOne()
      .sort({ createdAt: -1 })
      .select('employeeId')

    const lastNumber = lastEmployee?.employeeId
      ? Number.parseInt(lastEmployee.employeeId.replace('EMP', ''), 10)
      : 0

    const employeeId = `EMP${String(lastNumber + 1).padStart(5, '0')}`

    const employee = await Employee.create({
      employeeId,
      firstName,
      middleName: middleName || '',
      lastName,
      gender,
      birthDate,
      civilStatus,
      address,
      contactNumber,
      email,
      department,
      position,
      dateHired,
      employmentStatus,
      emergencyContact: {
        name: emergencyContactName,
        relationship: emergencyContactRelationship,
        phone: emergencyContactPhone
      },
      profilePhoto: req.file ? `/uploads/${req.file.filename}` : ''
    })

    return res.status(201).json(employee)
  } catch (error) {
    console.error('Create Employee Error:', error)

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'An employee with this email or employee ID already exists'
      })
    }

    return res.status(400).json({
      message: error.message || 'Unable to create employee'
    })
  }
}

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)

    if (!employee) {
      return res.status(404).json({
        message: 'Employee not found'
      })
    }

    const {
      firstName,
      middleName,
      lastName,
      gender,
      birthDate,
      civilStatus,
      address,
      contactNumber,
      email,
      department,
      position,
      dateHired,
      employmentStatus,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactPhone
    } = req.body

    employee.firstName = firstName
    employee.middleName = middleName || ''
    employee.lastName = lastName
    employee.gender = gender
    employee.birthDate = birthDate
    employee.civilStatus = civilStatus
    employee.address = address
    employee.contactNumber = contactNumber
    employee.email = email
    employee.department = department
    employee.position = position
    employee.dateHired = dateHired
    employee.employmentStatus = employmentStatus
    employee.emergencyContact = {
      name: emergencyContactName,
      relationship: emergencyContactRelationship,
      phone: emergencyContactPhone
    }

    if (req.file) {
      employee.profilePhoto = `/uploads/${req.file.filename}`
    }

    const updatedEmployee = await employee.save()

    return res.json(updatedEmployee)
  } catch (error) {
    console.error('Update Employee Error:', error)

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Another employee already uses this email'
      })
    }

    return res.status(400).json({
      message: error.message || 'Unable to update employee'
    })
  }
}

// @desc    Archive employee
// @route   POST /api/employees/:id/archive
// @access  Private/Admin
export const archiveEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)

    if (!employee) {
      return res.status(404).json({
        message: 'Employee not found'
      })
    }

    if (employee.isArchived) {
      return res.status(400).json({
        message: 'Employee is already archived'
      })
    }

    employee.isArchived = true
    employee.archivedAt = new Date()

    await employee.save()

    return res.json({
      message: 'Employee archived successfully',
      employee
    })
  } catch (error) {
    console.error('Archive Employee Error:', error)

    return res.status(500).json({
      message: 'Unable to archive employee'
    })
  }
}

// @desc    Soft-delete employee by archiving
// @route   DELETE /api/employees/:id
// @access  Private/Admin
export const deleteEmployee = archiveEmployee

// @desc    Restore archived employee
// @route   POST /api/employees/:id/restore
// @access  Private/Admin
export const restoreEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)

    if (!employee) {
      return res.status(404).json({
        message: 'Employee not found'
      })
    }

    if (!employee.isArchived) {
      return res.status(400).json({
        message: 'Employee is not archived'
      })
    }

    employee.isArchived = false
    employee.archivedAt = null

    await employee.save()

    return res.json({
      message: 'Employee restored successfully',
      employee
    })
  } catch (error) {
    console.error('Restore Employee Error:', error)

    return res.status(500).json({
      message: 'Unable to restore employee'
    })
  }
}

// @desc    Dashboard statistics
// @route   GET /api/employees/stats/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalEmployees,
      archivedEmployees,
      departmentStats,
      statusStats,
      recentEmployees
    ] = await Promise.all([
      Employee.countDocuments({ isArchived: false }),
      Employee.countDocuments({ isArchived: true }),
      Employee.aggregate([
        { $match: { isArchived: false } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Employee.aggregate([
        { $match: { isArchived: false } },
        { $group: { _id: '$employmentStatus', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Employee.find({ isArchived: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('employeeId firstName lastName department position profilePhoto')
    ])

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const newHiresThisMonth = await Employee.countDocuments({
      isArchived: false,
      dateHired: { $gte: startOfMonth }
    })

    return res.json({
      totalEmployees,
      archivedEmployees,
      departmentStats,
      statusStats,
      recentEmployees,
      newHiresThisMonth
    })
  } catch (error) {
    console.error('Dashboard Stats Error:', error)

    return res.status(500).json({
      message: 'Unable to load dashboard statistics'
    })
  }
}

// @desc    Get active departments
// @route   GET /api/employees/departments
// @access  Private
export const getDepartments = async (req, res) => {
  try {
    const departments = await Employee.distinct('department', {
      isArchived: false
    })

    return res.json(departments.filter(Boolean).sort())
  } catch (error) {
    console.error('Get Departments Error:', error)

    return res.status(500).json({
      message: 'Unable to load departments'
    })
  }
}

// @desc    Get active positions
// @route   GET /api/employees/positions
// @access  Private
export const getPositions = async (req, res) => {
  try {
    const positions = await Employee.distinct('position', {
      isArchived: false
    })

    return res.json(positions.filter(Boolean).sort())
  } catch (error) {
    console.error('Get Positions Error:', error)

    return res.status(500).json({
      message: 'Unable to load positions'
    })
  }
}