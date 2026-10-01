import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
}

// @desc    Administrator login
// @route   POST /api/auth/login
// @access  Public, but only admin credentials are accepted
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({
      email: normalizedEmail
    }).select('+password')

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    // Critical restriction: only admin accounts can use the system.
    if (user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. This system is for administrators only.'
      })
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } catch (error) {
    console.error('Login Error:', error)

    return res.status(500).json({
      message: error.message || 'Server error during login'
    })
  }
}

// @desc    Get current administrator profile
// @route   GET /api/auth/profile
// @access  Private/Admin
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    console.error('Profile Error:', error)

    return res.status(500).json({
      message: error.message || 'Server error'
    })
  }
}

// @desc    Update current administrator profile
// @route   PUT /api/auth/profile
// @access  Private/Admin
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    if (req.body.name?.trim()) {
      user.name = req.body.name.trim()
    }

    if (req.body.email?.trim()) {
      const normalizedEmail = req.body.email.toLowerCase().trim()

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id }
      })

      if (existingUser) {
        return res.status(400).json({
          message: 'Another user already uses this email'
        })
      }

      user.email = normalizedEmail
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({
          message: 'Password must be at least 6 characters'
        })
      }

      user.password = req.body.password
    }

    // Do not allow a request to change account role.
    const updatedUser = await user.save()

    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id)
    })
  } catch (error) {
    console.error('Update Profile Error:', error)

    return res.status(500).json({
      message: error.message || 'Server error'
    })
  }
}