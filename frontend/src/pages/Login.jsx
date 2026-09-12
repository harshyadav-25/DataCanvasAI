import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DataPipeline3D from '../components/DataPipeline3D'

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
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

      {/* =========================================
          3D BACKGROUND
          ========================================= */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        {/* Blue Glow */}
        <div
          className="
            absolute
            -right-[15%]
            -top-[15%]
            h-[850px]
            w-[850px]
            rounded-full
            bg-[#3158FF]/20
            blur-[180px]
          "
        />

        {/* Purple Glow */}
        <div
          className="
            absolute
            -left-[15%]
            top-[20%]
            h-[750px]
            w-[750px]
            rounded-full
            bg-[#7C3AED]/15
            blur-[170px]
          "
        />

        {/* Bottom Glow */}
        <div
          className="
            absolute
            bottom-[-20%]
            left-[25%]
            h-[700px]
            w-[700px]
            rounded-full
            bg-[#2563EB]/10
            blur-[160px]
          "
        />

        {/* 3D Data Pipeline */}
        <div className="absolute inset-0">
          <DataPipeline3D />
        </div>

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
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

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#050816]/35" />
      </div>

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

            {/* Logo Icon */}
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-[#756BFF]/30
                bg-[#5148D8]/15
                shadow-[0_0_30px_rgba(81,72,216,0.25)]
                backdrop-blur-xl
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

            {/* Logo Text */}
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
              bg-[#080D1B]/70
              p-8
              shadow-[0_30px_100px_rgba(0,0,0,0.45)]
              backdrop-blur-2xl
            "
          >

            {/* Card Glow */}
            <div
              className="
                pointer-events-none
                absolute
                -right-32
                -top-32
                h-72
                w-72
                rounded-full
                bg-[#5148D8]/15
                blur-[100px]
              "
            />

            <div className="relative">

              {/* =========================================
                  HEADING
                  ========================================= */}
              <div>
                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#8177FF]
                  "
                >
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
                    text-[#8793AE]
                  "
                >
                  Continue to your DataCanvasAI workspace.
                </p>
              </div>

              {/* =========================================
                  ERROR
                  ========================================= */}
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
                    text-red-300
                  "
                >
                  {error}
                </div>
              )}

              {/* =========================================
                  FORM
                  ========================================= */}
              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >

                {/* Email */}
                <div>
                  <label
                    className="
                      block
                      text-sm
                      font-medium
                      text-[#D7DCEF]
                    "
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
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
                      placeholder:text-[#65718E]
                      backdrop-blur-md
                      transition
                      focus:border-[#756BFF]/60
                      focus:bg-white/[0.06]
                      focus:ring-2
                      focus:ring-[#756BFF]/10
                    "
                  />
                </div>

                {/* Password */}
                <div>

                  <div className="flex items-center justify-between">

                    <label
                      className="
                        block
                        text-sm
                        font-medium
                        text-[#D7DCEF]
                      "
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="
                        text-xs
                        font-medium
                        text-[#8177FF]
                        transition
                        hover:text-[#A69EFF]
                        hover:underline
                      "
                    >
                      Forgot password?
                    </button>

                  </div>

                  <input
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
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
                      placeholder:text-[#65718E]
                      backdrop-blur-md
                      transition
                      focus:border-[#756BFF]/60
                      focus:bg-white/[0.06]
                      focus:ring-2
                      focus:ring-[#756BFF]/10
                    "
                  />

                </div>

                {/* Remember */}
                <label
                  className="
                    flex
                    cursor-pointer
                    items-center
                    gap-3
                    text-sm
                    text-[#8793AE]
                  "
                >
                  <input
                    type="checkbox"
                    className="
                      h-4
                      w-4
                      accent-[#756BFF]
                    "
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
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-[0_0_45px_rgba(81,72,216,0.4)]
                  "
                >
                  Sign In
                </button>

              </form>

              {/* =========================================
                  REGISTER
                  ========================================= */}
              <p
                className="
                  mt-7
                  text-center
                  text-sm
                  text-[#7F8BA8]
                "
              >
                Don't have an account?{' '}

                <Link
                  to="/register"
                  className="
                    font-semibold
                    text-[#8177FF]
                    transition
                    hover:text-[#A69EFF]
                    hover:underline
                  "
                >
                  Create account
                </Link>
              </p>

            </div>
          </div>

          {/* Small Footer Text */}
          <p className="mt-5 text-center text-xs text-[#4F5B76]">
            AI-powered dataset intelligence
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login