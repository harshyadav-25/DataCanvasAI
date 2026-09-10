import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="h-[68px] bg-white border-b border-[#E5E7F0] flex items-center justify-between px-6 lg:px-10">

      {/* Search */}
      <div className="relative w-full max-w-md">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>

        <input
          type="text"
          placeholder="Search datasets, tools or help..."
          className="w-full h-10 rounded-lg bg-[#F7F8FC] border border-[#E5E7F0] pl-10 pr-16 text-sm outline-none focus:border-[#5B56E8] focus:ring-2 focus:ring-[#EEF0FF]"
        />

        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#98A2B3] bg-white border border-[#E5E7F0] rounded px-2 py-1">
          Ctrl K
        </span>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5 ml-6">

        {/* Notification */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#667085] hover:bg-[#F7F8FC] hover:text-[#17213A]"
            aria-label="Notifications"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M10 21h4" />
            </svg>

            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-[#E5E7F0] bg-white shadow-lg">

              <div className="flex items-center justify-between border-b border-[#EEF0F4] px-4 py-3">
                <h3 className="text-sm font-bold text-[#17213A]">
                  Notifications
                </h3>

                <span className="text-xs text-[#98A2B3]">
                  2 new
                </span>
              </div>

              <div className="p-2">

                <div className="rounded-lg px-3 py-3 hover:bg-[#F7F8FC]">
                  <p className="text-sm font-semibold text-[#17213A]">
                    Welcome to DataCanvasAI
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#667085]">
                    Upload a dataset to start your analysis.
                  </p>
                </div>

                <div className="rounded-lg px-3 py-3 hover:bg-[#F7F8FC]">
                  <p className="text-sm font-semibold text-[#17213A]">
                    Dataset analysis ready
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#667085]">
                    Your ML readiness insights will appear here.
                  </p>
                </div>

              </div>

              <div className="border-t border-[#EEF0F4] px-4 py-3">
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-[#5B56E8] hover:underline"
                >
                  Mark all as read
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Guest Profile */}
        <Link
          to="/login"
          className="flex items-center gap-3 rounded-lg px-2 py-1 transition hover:bg-[#F7F8FC]"
        >
          <div className="w-9 h-9 rounded-xl bg-[#5B56E8] flex items-center justify-center text-white font-semibold">
            G
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[#17213A]">
              Guest
            </p>

            <p className="text-xs text-[#98A2B3]">
              Sign in
            </p>
          </div>

          <svg
            className="w-4 h-4 text-[#98A2B3]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Link>

      </div>
    </header>
  )
}

export default Header