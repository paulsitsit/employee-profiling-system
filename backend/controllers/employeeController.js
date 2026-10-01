import Employee from '../models/Employee.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate unique employee ID
const generateEmployeeId = async () => {
  const count = await Employee.countDocuments();
  return `EMP${String(count + 1).padStart(5, '0')}`;
};

// @desc    Get all employees with search, filter, pagination
// @route   GET /api/employees
// @access  Private
export const getEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      department = '',
      position = '',
      employmentStatus = '',
      isArchived = 'false'
    } = req.query;

    const query = { isArchived: isArchived === 'true' };

    // Search filter
    if (search) {
      query.$or = [
        { employeeId: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ];
    }

    // Additional filters
    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }
    if (position) {
      query.position = { $regex: position, $options: 'i' };
    }
    if (employmentStatus) {
      query.employmentStatus = employmentStatus;
    }

    const skip = (page - 1) * limit;
    const employees = await Employee.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Employee.countDocuments(query);

    res.json({
      employees,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total,
      hasMore: page * limit < total
    });
  } catch (error) {
    console.error('Get Employees Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Private
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Get Employee Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get single employee by employeeId
// @route   GET /api/employees/by-id/:employeeId
// @access  Private
export const getEmployeeByEmployeeId = async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeId: req.params.employeeId });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Get Employee Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private/Admin
export const createEmployee = async (req, res) => {
  try {
    const employeeId = await generateEmployeeId();
    
    const employeeData = {
      ...req.body,
      employeeId,
      profilePhoto: req.file ? `/uploads/${req.file.filename}` : ''
    };

    const employee = await Employee.create(employeeData);
    res.status(201).json(employee);
  } catch (error) {
    console.error('Create Employee Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Employee with this email or ID already exists' });
    }
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update fields
    Object.assign(employee, req.body);

    // Update profile photo if new file uploaded
    if (req.file) {
      employee.profilePhoto = `/uploads/${req.file.filename}`;
    }

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Update Employee Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete employee (soft delete - archive)
// @route   DELETE /api/employees/:id
// @access  Private/Admin
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.isArchived = true;
    employee.archivedAt = new Date();
    await employee.save();

    res.json({ message: 'Employee archived successfully' });
  } catch (error) {
    console.error('Delete Employee Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Archive employee
// @route   POST /api/employees/:id/archive
// @access  Private/Admin
export const archiveEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (employee.isArchived) {
      return res.status(400).json({ message: 'Employee is already archived' });
    }

    employee.isArchived = true;
    employee.archivedAt = new Date();
    await employee.save();

    res.json({ message: 'Employee archived successfully', employee });
  } catch (error) {
    console.error('Archive Employee Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Restore archived employee
// @route   POST /api/employees/:id/restore
// @access  Private/Admin
export const restoreEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (!employee.isArchived) {
      return res.status(400).json({ message: 'Employee is not archived' });
    }

    employee.isArchived = false;
    employee.archivedAt = null;
    await employee.save();

    res.json({ message: 'Employee restored successfully', employee });
  } catch (error) {
    console.error('Restore Employee Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/employees/stats/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments({ isArchived: false });
    const archivedEmployees = await Employee.countDocuments({ isArchived: true });
    
    // Department breakdown
    const departmentStats = await Employee.aggregate([
      { $match: { isArchived: false } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Employment status breakdown
    const statusStats = await Employee.aggregate([
      { $match: { isArchived: false } },
      { $group: { _id: '$employmentStatus', count: { $sum: 1 } } }
    ]);

    // Recent employees (last 5)
    const recentEmployees = await Employee.find({ isArchived: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('employeeId firstName lastName department position profilePhoto');

    // New hires this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newHiresThisMonth = await Employee.countDocuments({
      isArchived: false,
      dateHired: { $gte: startOfMonth }
    });

    res.json({
      totalEmployees,
      archivedEmployees,
      departmentStats,
      statusStats,
      recentEmployees,
      newHiresThisMonth
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get unique departments
// @route   GET /api/employees/departments
// @access  Private
export const getDepartments = async (req, res) => {
  try {
    const departments = await Employee.distinct('department', { isArchived: false });
    res.json(departments);
  } catch (error) {
    console.error('Get Departments Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get unique positions
// @route   GET /api/employees/positions
// @access  Private
export const getPositions = async (req, res) => {
  try {
    const positions = await Employee.distinct('position', { isArchived: false });
    res.json(positions);
  } catch (error) {
    console.error('Get Positions Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};