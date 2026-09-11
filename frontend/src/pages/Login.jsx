import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    // Temporary frontend-only login flow
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#EEF0FF] flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[#5B56E8]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <ellipse cx="12" cy="5" rx="7" ry="3" />
              <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
              <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
            </svg>
          </div>

          <span className="text-xl font-bold text-[#5B56E8]">
            DataCanvasAI
          </span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#E5E7F0] bg-white p-8 shadow-sm">

          <div>
            <p className="text-sm font-semibold text-[#5B56E8]">
              Welcome back
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#17213A]">
              Sign in to your account
            </h1>

            <p className="mt-2 text-sm text-[#667085]">
              Continue to your DataCanvasAI workspace.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#17213A]">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full h-11 rounded-lg border border-[#DDE0EA] bg-white px-4 text-sm text-[#17213A] outline-none placeholder:text-[#98A2B3] focus:border-[#5B56E8] focus:ring-2 focus:ring-[#EEF0FF]"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-[#17213A]">
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-medium text-[#5B56E8] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="mt-2 w-full h-11 rounded-lg border border-[#DDE0EA] bg-white px-4 text-sm text-[#17213A] outline-none placeholder:text-[#98A2B3] focus:border-[#5B56E8] focus:ring-2 focus:ring-[#EEF0FF]"
              />
            </div>

            {/* Remember */}
            <label className="flex items-center gap-3 text-sm text-[#667085]">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[#5B56E8]"
              />

              Remember me
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-[#5B56E8] text-sm font-semibold text-white transition hover:bg-[#4D47D5]"
            >
              Sign In
            </button>

          </form>

          {/* Register */}
          <p className="mt-7 text-center text-sm text-[#667085]">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-[#5B56E8] hover:underline"
            >
              Create account
            </Link>
          </p>

        </div>

      </div>
    </div>
  )
}

export default Login