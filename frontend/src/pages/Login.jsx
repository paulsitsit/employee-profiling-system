import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import MagicRings from '../components/MagicRings'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      await login(formData.email.trim(), formData.password)

      toast.success('Administrator login successful!')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Login failed. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary-800 to-primary-900 px-4">
      {/* Animated background: it cannot block login controls */}
      <div className="pointer-events-none absolute inset-0 opacity-30 sm:opacity-45">
        <MagicRings
          color="#48df48"
          colorTwo="#35cdef"
          ringCount={6}
          speed={0.7}
          attenuation={10}
          lineThickness={2}
          baseRadius={0.35}
          radiusStep={0.1}
          scaleRate={0.1}
          opacity={1}
          blur={0}
          noiseAmount={0.05}
          rotation={0}
          ringGap={1.5}
          fadeIn={0.7}
          fadeOut={0.5}
          followMouse={false}
          mouseInfluence={0.2}
          hoverScale={1.2}
          parallax={0.05}
          clickBurst={false}
        />
      </div>

      {/* Login form remains above the background */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          {/* Application logo and heading */}
          <div className="mb-8 text-center">
            <div className="mb-5 flex justify-center">
              <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg">
                <img
                  src="/logo.jpg"
                  alt="Employee Profiling System"
                  className="login-logo-crop h-full w-full object-contain"
                />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800">
              Administrator Login
            </h1>

            <p className="mt-2 text-gray-600">
              Sign in with your authorized administrator account
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail size={20} className="text-gray-400" />
                </div>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary-800"
                  placeholder="admin@company.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock size={20} className="text-gray-400" />
                </div>

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-12 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary-800"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff
                      size={20}
                      className="text-gray-400 hover:text-gray-600"
                    />
                  ) : (
                    <Eye
                      size={20}
                      className="text-gray-400 hover:text-gray-600"
                    />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-800 py-3 font-medium text-white transition-colors hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In as Administrator
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-gray-50 px-4 py-3 text-center text-sm text-gray-600">
            Access is restricted to authorized system administrators.
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-200">
          © 2026 Employee Profiling Management System
        </p>
      </div>
    </div>
  )
}

export default Login