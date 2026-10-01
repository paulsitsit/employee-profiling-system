import express from 'express'
import {
  getEmployees,
  getEmployeeById,
  getEmployeeByEmployeeId,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  archiveEmployee,
  restoreEmployee,
  getDashboardStats,
  getDepartments,
  getPositions
} from '../controllers/employeeController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

/* Specific GET routes MUST be first */
router.get('/stats/dashboard', protect, getDashboardStats)
router.get('/departments', protect, getDepartments)
router.get('/positions', protect, getPositions)
router.get('/by-id/:employeeId', protect, getEmployeeByEmployeeId)

/* General routes */
router.get('/', protect, getEmployees)
router.get('/:id', protect, getEmployeeById)

/* Admin-only routes */
router.post('/', protect, adminOnly, upload.single('profilePhoto'), createEmployee)
router.put('/:id', protect, adminOnly, upload.single('profilePhoto'), updateEmployee)
router.delete('/:id', protect, adminOnly, deleteEmployee)
router.post('/:id/archive', protect, adminOnly, archiveEmployee)
router.post('/:id/restore', protect, adminOnly, restoreEmployee)

export default router