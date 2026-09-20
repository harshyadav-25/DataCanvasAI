import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/api'

function Login() {
  const navigate = useNavigate()

  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const email = emailRef.current?.value.trim() || ''
    const password = passwordRef.current?.value || ''

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    try {
      const data = await login({ email, password })
      localStorage.setItem('datacanvas_access_token', data.access_token)
      localStorage.setItem('datacanvas_auth', 'true')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.userMessage || 'Unable to sign in. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

      {/* =========================================
          STATIC BACKGROUND
          ========================================= */}

      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 85% 15%,
              rgba(49, 88, 255, 0.18),
              transparent 32%
            ),
            radial-gradient(
              circle at 10% 35%,
              rgba(124, 58, 237, 0.14),
              transparent 30%
            ),
            radial-gradient(
              circle at 45% 100%,
              rgba(37, 99, 235, 0.10),
              transparent 28%
            )
          `,
        }}
      />

      {/* Static grid */}

      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,0.4) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.4) 1px,
              transparent 1px
            )
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Dark overlay */}

      <div className="pointer-events-none fixed inset-0 z-0 bg-[#050816]/35" />

      {/* =========================================
          LOGIN CONTENT
          ========================================= */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-4
          py-10
        "
      >
        <div className="w-full max-w-md">

          {/* =========================================
              LOGO
              ========================================= */}

          <div className="mb-8 flex items-center justify-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-[#756BFF]/30
                bg-[#5148D8]/15
                shadow-[0_0_30px_rgba(81,72,216,0.25)]
              "
            >
              <svg
                className="h-6 w-6 text-[#8B7CFF]"
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

            <span
              className="
                bg-gradient-to-r
                from-[#8B7CFF]
                via-[#756BFF]
                to-[#38BDF8]
                bg-clip-text
                text-xl
                font-bold
                text-transparent
              "
            >
              DataCanvasAI
            </span>

          </div>

          {/* =========================================
              LOGIN CARD
              ========================================= */}

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/[0.1]
              bg-[#080D1B]
              p-8
              shadow-[0_30px_100px_rgba(0,0,0,0.45)]
            "
          >

            {/* Small static glow */}

            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-64
                w-64
                rounded-full
                bg-[#5148D8]/10
              "
              style={{
                filter: 'blur(70px)',
              }}
            />

            <div className="relative">

              {/* Heading */}

              <div>
                <p className="text-sm font-semibold text-[#A9A4FF]">
                  Welcome back
                </p>

                <h1
                  className="
                    mt-2
                    text-3xl
                    font-bold
                    tracking-tight
                    text-white
                  "
                >
                  Sign in to your account
                </h1>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-white
                  "
                >
                  Sign in to continue to your DataCanvasAI workspace.
                </p>
              </div>

              {/* Error */}

              {error && (
                <div
                  className="
                    mt-5
                    rounded-xl
                    border
                    border-red-400/20
                    bg-red-500/10
                    px-4
                    py-3
                    text-sm
                    text-red-200
                  "
                >
                  {error}
                </div>
              )}

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >

                {/* Email */}

                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-sm font-medium text-white"
                  >
                    Email
                  </label>

                  <input
                    ref={emailRef}
                    id="login-email"
                    type="email"
                    defaultValue=""
                    placeholder="you@example.com"
                    autoComplete="email"
                    onChange={() => {
                      if (error) {
                        setError('')
                      }
                    }}
                    className="
                      mt-2
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-white/[0.1]
                      bg-white/[0.04]
                      px-4
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-white/60
                      focus:border-[#756BFF]/60
                      focus:bg-white/[0.06]
                      focus:ring-2
                      focus:ring-[#756BFF]/10
                    "
                  />
                </div>

                {/* Password */}

                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium text-white"
                  >
                    Password
                  </label>

                  <input
                    ref={passwordRef}
                    id="login-password"
                    type="password"
                    defaultValue=""
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    onChange={() => {
                      if (error) {
                        setError('')
                      }
                    }}
                    className="
                      mt-2
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-white/[0.1]
                      bg-white/[0.04]
                      px-4
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-white/60
                      focus:border-[#756BFF]/60
                      focus:bg-white/[0.06]
                      focus:ring-2
                      focus:ring-[#756BFF]/10
                    "
                  />
                </div>

                {/* Remember Me */}

                <label
                  className="
                    flex
                    cursor-pointer
                    items-center
                    gap-3
                    text-sm
                    text-white
                  "
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[#756BFF]"
                  />

                  Remember me
                </label>

                {/* Submit */}

                <button
                  type="submit"
                  className="
                    h-11
                    w-full
                    rounded-xl
                    bg-gradient-to-r
                    from-[#5148D8]
                    to-[#756BFF]
                    text-sm
                    font-semibold
                    text-white
                    shadow-[0_0_30px_rgba(81,72,216,0.25)]
                    hover:shadow-[0_0_40px_rgba(81,72,216,0.3)]
                  "
                >
                  Sign In
                </button>

              </form>

              {/* Register */}

              <p
                className="
                  mt-7
                  text-center
                  text-sm
                  text-white
                "
              >
                Don't have an account?{' '}

                <Link
                  to="/register"
                  className="
                    font-semibold
                    text-[#A9A4FF]
                    hover:text-[#C0BBFF]
                    hover:underline
                  "
                >
                  Create account
                </Link>
              </p>

            </div>
          </div>

          {/* Footer */}

          <p className="mt-5 text-center text-xs text-white">
            AI-powered dataset intelligence
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login