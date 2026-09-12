import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DataPipeline3D from '../components/DataPipeline3D'

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!accepted) {
      setError('Please accept the Terms of Service and Privacy Policy.')
      return
    }

    // Temporary frontend-only flow
    navigate('/login')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

      {/* =====================================================
          FULL SCREEN 3D BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        {/* Main Blue Glow */}

        <div className="absolute -right-[15%] -top-[15%] h-[850px] w-[850px] rounded-full bg-[#3158FF]/18 blur-[180px]" />

        {/* Purple Glow */}

        <div className="absolute -left-[15%] top-[20%] h-[750px] w-[750px] rounded-full bg-[#7C3AED]/14 blur-[170px]" />

        {/* Bottom Blue Glow */}

        <div className="absolute bottom-[-20%] left-[25%] h-[700px] w-[700px] rounded-full bg-[#2563EB]/9 blur-[160px]" />

        {/* 3D Scene */}

        <div className="absolute inset-0">
          <DataPipeline3D />
        </div>

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,0.45) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,0.45) 1px,
                transparent 1px
              )
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Soft Overall Overlay */}

        <div className="absolute inset-0 bg-[#050816]/35" />

      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 min-h-screen lg:flex">

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <div className="relative hidden min-h-screen overflow-hidden lg:flex lg:w-[56%]">

          {/* Left Side Soft Overlay */}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050816]/20 via-transparent to-[#050816]/15" />

          {/* Logo */}

          <div className="relative z-20 flex w-full items-start px-10 py-8 xl:px-14">

            <div className="flex items-center gap-3">

              {/* Logo Icon */}

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#5B56E8]
                  shadow-[0_0_25px_rgba(91,86,232,0.35)]
                "
              >
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <ellipse
                    cx="12"
                    cy="5"
                    rx="7"
                    ry="3"
                  />

                  <path
                    d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5"
                  />

                  <path
                    d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7"
                  />
                </svg>
              </div>

              {/* Logo Text */}

              <div>

                <p className="text-xl font-bold leading-tight text-white">
                  DataCanvas
                  <span className="text-[#9A8FFF]">AI</span>
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Clean Data. Smarter Models.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <div
          className="
            relative
            flex
            min-h-screen
            flex-1
            items-center
            justify-center
            overflow-hidden
            px-6
            py-10
            lg:px-10
          "
        >

          {/* Right Side Overlay */}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#050816]/45 via-[#050816]/15 to-transparent" />

          {/* =====================================================
              FORM AREA
          ====================================================== */}

          <div className="relative z-20 w-full max-w-[500px]">

            {/* Mobile Logo */}

            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#5B56E8]
                  shadow-[0_0_25px_rgba(91,86,232,0.35)]
                "
              >
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <ellipse
                    cx="12"
                    cy="5"
                    rx="7"
                    ry="3"
                  />

                  <path
                    d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5"
                  />

                  <path
                    d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7"
                  />
                </svg>
              </div>

              <span className="text-xl font-bold text-white">
                DataCanvas
                <span className="text-[#9A8FFF]">AI</span>
              </span>

            </div>

            {/* =====================================================
                FORM CARD
            ====================================================== */}

            <div
              className="
                rounded-[28px]
                border
                border-white/[0.10]
                bg-[#080D1A]/58
                p-7
                shadow-[0_0_80px_rgba(0,0,0,0.35)]
                backdrop-blur-xl
                md:p-9
              "
            >

              {/* Heading */}

              <div>

                <p className="text-sm font-semibold text-[#A69CFF]">
                  Get started
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">

                  Create your{' '}

                  <span className="bg-gradient-to-r from-[#A794FF] to-[#58D7FF] bg-clip-text text-transparent">
                    account
                  </span>

                </h2>

                <p className="mt-3 text-sm leading-6 text-white/70">
                  Create your DataCanvasAI account to begin.
                </p>

              </div>

              {/* Error */}

              {error && (
                <div className="mt-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* =====================================================
                  FORM
              ====================================================== */}

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >

                {/* Full Name */}

                <div>

                  <label className="block text-sm font-semibold text-white">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your full name"
                    className="
                      mt-2
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-white/[0.10]
                      bg-white/[0.04]
                      px-4
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-white/35
                      backdrop-blur-sm
                      transition
                      focus:border-[#756BFF]/60
                      focus:bg-white/[0.06]
                      focus:ring-2
                      focus:ring-[#756BFF]/10
                    "
                  />

                </div>

                {/* Email */}

                <div>

                  <label className="block text-sm font-semibold text-white">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="
                      mt-2
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-white/[0.10]
                      bg-white/[0.04]
                      px-4
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-white/35
                      backdrop-blur-sm
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

                  <label className="block text-sm font-semibold text-white">
                    Password
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a password"
                    className="
                      mt-2
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-white/[0.10]
                      bg-white/[0.04]
                      px-4
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-white/35
                      backdrop-blur-sm
                      transition
                      focus:border-[#756BFF]/60
                      focus:bg-white/[0.06]
                      focus:ring-2
                      focus:ring-[#756BFF]/10
                    "
                  />

                </div>

                {/* Confirm Password */}

                <div>

                  <label className="block text-sm font-semibold text-white">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Confirm your password"
                    className="
                      mt-2
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-white/[0.10]
                      bg-white/[0.04]
                      px-4
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-white/35
                      backdrop-blur-sm
                      transition
                      focus:border-[#756BFF]/60
                      focus:bg-white/[0.06]
                      focus:ring-2
                      focus:ring-[#756BFF]/10
                    "
                  />

                </div>

                {/* Terms */}

                <label className="flex cursor-pointer items-start gap-3">

                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(event) =>
                      setAccepted(event.target.checked)
                    }
                    className="mt-1 h-4 w-4 accent-[#6D5CFF]"
                  />

                  <span className="text-xs leading-5 text-white/75">

                    I agree to the{' '}

                    <span className="font-semibold text-[#A69EFF]">
                      Terms of Service
                    </span>{' '}

                    and{' '}

                    <span className="font-semibold text-[#A69EFF]">
                      Privacy Policy
                    </span>.

                  </span>

                </label>

                {/* Button */}

                <button
                  type="submit"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    bg-gradient-to-r
                    from-[#5148D8]
                    to-[#6D5CFF]
                    text-sm
                    font-semibold
                    text-white
                    shadow-[0_0_30px_rgba(81,72,216,0.25)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-[0_0_40px_rgba(81,72,216,0.4)]
                  "
                >
                  Create Account
                </button>

              </form>

              {/* Login */}

              <p className="mt-7 text-center text-sm text-white/70">

                Already have an account?{' '}

                <Link
                  to="/login"
                  className="font-semibold text-[#A69EFF] transition hover:text-[#C0B9FF] hover:underline"
                >
                  Log in
                </Link>

              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default Register