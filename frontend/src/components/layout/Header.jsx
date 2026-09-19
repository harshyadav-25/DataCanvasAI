import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()

  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const storedUser = localStorage.getItem('datacanvas_user')

  let user = {
    name: 'User',
    email: '',
  }

  if (storedUser) {
    try {
      user = JSON.parse(storedUser)
    } catch {
      user = {
        name: 'User',
        email: '',
      }
    }
  }

  const displayName = user.name || 'User'
  const firstLetter = displayName.charAt(0).toUpperCase()

  const handleLogout = () => {
    localStorage.removeItem('datacanvas_auth')
    localStorage.removeItem('datacanvas_user')

    setShowProfileMenu(false)

    navigate('/', { replace: true })
  }

  return (
    <header
      className="
        fixed
        left-52
        right-0
        top-0
        z-50
        h-17
        border-b
        border-white/8
        bg-[#050816]/55
        backdrop-blur-xl
      "
    >
      {/* =========================================
          HEADER CONTENT
          ========================================= */}

      <div
        className="
          flex
          h-full
          items-center
          justify-between
          px-6
          lg:px-10
        "
      >

        {/* =========================================
            SEARCH
            ========================================= */}

        <div className="relative w-full max-w-md">

          {/* Search Icon */}
          <svg
            className="
              absolute
              left-3
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-[#7D89A8]
            "
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search datasets, tools or help..."
            className="
              h-10
              w-full
              rounded-xl
              border
              border-white/8
              bg-white/4
              pl-10
              pr-16
              text-sm
              text-white
              placeholder:text-[#66728F]
              outline-none
              backdrop-blur-md
              transition
              focus:border-[#635BFF]/60
              focus:bg-white/6
              focus:ring-2
              focus:ring-[#635BFF]/10
            "
          />

          {/* Ctrl K */}
          <span
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              rounded-md
              border
              border-white/8
              bg-white/5
              px-2
              py-1
              text-xs
              text-[#7D89A8]
            "
          >
            Ctrl K
          </span>
        </div>

        {/* =========================================
            RIGHT SIDE
            ========================================= */}

        <div className="ml-6 flex items-center gap-5">

          {/* =========================================
              NOTIFICATION BUTTON
              ========================================= */}

          <button
            type="button"
            className="
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-transparent
              text-[#9AA5BF]
              transition
              hover:border-white/8
              hover:bg-white/5
              hover:text-white
            "
            aria-label="Notifications"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M13.7 21a2 2 0 0 1-3.4 0" />
            </svg>

            {/* Notification Dot */}
            <span
              className="
                absolute
                right-2
                top-2
                h-2
                w-2
                rounded-full
                bg-[#756BFF]
                shadow-[0_0_8px_rgba(117,107,255,0.8)]
              "
            />
          </button>

          {/* =========================================
              PROFILE
              ========================================= */}

          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setShowProfileMenu((current) => !current)
              }
              className="
                flex
                items-center
                gap-3
                rounded-xl
                px-2
                py-1
                transition-all
                duration-200
                hover:bg-white/6
              "
            >

              {/* Avatar */}
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#756BFF]/30
                  bg-linear-to-br
                  from-[#5148D8]
                  to-[#7C5CFF]
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_0_20px_rgba(81,72,216,0.25)]
                "
              >
                {firstLetter}
              </div>

              {/* User Info */}
              <div className="hidden text-left sm:block">

                <p className="max-w-32.5 truncate text-sm font-semibold text-white">
                  {displayName}
                </p>

                <p className="max-w-40 truncate text-xs text-[#7D89A8]">
                  {user.email || 'Signed in'}
                </p>

              </div>

              {/* Arrow */}
              <svg
                className={`
                  h-4
                  w-4
                  text-[#7885A4]
                  transition-transform
                  duration-200
                  ${showProfileMenu ? 'rotate-180' : ''}
                `}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>

            </button>

            {/* =========================================
                PROFILE DROPDOWN
                ========================================= */}

            {showProfileMenu && (
              <div
                className="
                  absolute
                  right-0
                  mt-3
                  w-64
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#080D1B]/95
                  shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                  backdrop-blur-2xl
                "
              >

                {/* User Info */}
                <div className="border-b border-white/8 px-4 py-4">

                  <p className="truncate text-sm font-semibold text-white">
                    {displayName}
                  </p>

                  <p className="mt-1 truncate text-xs text-[#7D89A8]">
                    {user.email || 'Signed in'}
                  </p>

                </div>

                {/* Dashboard */}
                <Link
                  to="/dashboard"
                  onClick={() => setShowProfileMenu(false)}
                  className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-[#D7DCEF]
                    transition
                    hover:bg-white/5
                    hover:text-white
                  "
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                    />

                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                    />

                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                    />

                    <rect
                      x="14"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                    />
                  </svg>

                  Dashboard
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    border-t
                    border-white/8
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-medium
                    text-red-300
                    transition
                    hover:bg-red-500/8
                    hover:text-red-200
                  "
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10 17l5-5-5-5" />
                    <path d="M15 12H3" />
                    <path d="M21 4v16" />
                  </svg>

                  Logout
                </button>

              </div>
            )}

          </div>

        </div>

      </div>
    </header>
  )
}

export default Header