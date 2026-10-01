import express from 'express'
import {
  login,
  getProfile,
  updateProfile
} from '../controllers/authController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

// No public registration endpoint exists.
router.post('/login', login)

// Profile management is available only to the signed-in admin.
router.get('/profile', protect, adminOnly, getProfile)
router.put('/profile', protect, adminOnly, updateProfile)

export default router