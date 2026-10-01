import express from 'express';
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
} from '../controllers/employeeController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes (accessible with valid token)
router.get('/stats/dashboard', protect, getDashboardStats);
router.get('/departments', protect, getDepartments);
router.get('/positions', protect, getPositions);

// Employee routes
router.get('/', protect, getEmployees);
router.get('/by-id/:employeeId', protect, getEmployeeByEmployeeId);
router.get('/:id', protect, getEmployeeById);
router.post('/', protect, adminOnly, upload.single('profilePhoto'), createEmployee);
router.put('/:id', protect, adminOnly, upload.single('profilePhoto'), updateEmployee);
router.delete('/:id', protect, adminOnly, deleteEmployee);

// Archive/Restore routes
router.post('/:id/archive', protect, adminOnly, archiveEmployee);
router.post('/:id/restore', protect, adminOnly, restoreEmployee);

export default router;