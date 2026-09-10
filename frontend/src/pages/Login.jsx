function Login() {
  return (
    <div className="min-h-[calc(100vh-68px)] flex items-center justify-center bg-[#F7F8FC] px-4">

      <div className="w-full max-w-md rounded-2xl border border-[#E5E7F0] bg-white p-8 shadow-sm">

        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#5B56E8]">
            <svg
              className="h-6 w-6"
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

          <h1 className="mt-4 text-2xl font-bold text-[#17213A]">
            Welcome to DataCanvasAI
          </h1>

          <p className="mt-2 text-sm text-[#667085]">
            Sign in to continue to your workspace
          </p>
        </div>

        <form className="mt-8 space-y-5">

          <div>
            <label className="block text-sm font-medium text-[#17213A]">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-lg border border-[#E5E7F0] bg-[#F7F8FC] px-4 py-3 text-sm outline-none focus:border-[#5B56E8] focus:ring-2 focus:ring-[#EEF0FF]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#17213A]">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="mt-2 w-full rounded-lg border border-[#E5E7F0] bg-[#F7F8FC] px-4 py-3 text-sm outline-none focus:border-[#5B56E8] focus:ring-2 focus:ring-[#EEF0FF]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#5B56E8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4D47D5]"
          >
            Sign In
          </button>

        </form>

        <p className="mt-6 text-center text-xs text-[#98A2B3]">
          DataCanvasAI · Dataset Intelligence Platform
        </p>

      </div>
    </div>
  )
}

export default Login