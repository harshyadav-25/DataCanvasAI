import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Header({ sidebarOpen }) {
  const navigate = useNavigate()

  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('datacanvas_theme') === 'light'
  })

  // =====================================================
  // GET USER
  // =====================================================

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

  // =====================================================
  // APPLY THEME
  // =====================================================

  useEffect(() => {
    const theme = isLightMode ? 'light' : 'dark'

    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('datacanvas_theme', theme)
  }, [isLightMode])

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem('datacanvas_auth')
    localStorage.removeItem('datacanvas_access_token')
    localStorage.removeItem('datacanvas_user')

    setShowProfileMenu(false)

    navigate('/', { replace: true })
  }

  // =====================================================
  // TOGGLE THEME
  // =====================================================

  const handleThemeToggle = () => {
    setIsLightMode((current) => !current)
  }

  return (
    <header
      className={`
        fixed
        right-0
        top-0
        z-50
        h-[68px]
        border-b
        border-white/8
        bg-[#050816]/55
        backdrop-blur-xl
        transition-[left]
        duration-300
        ease-in-out
        ${sidebarOpen ? 'left-0 lg:left-52' : 'left-0'}
      `}
    >
      {/* =====================================================
          HEADER CONTENT
          ===================================================== */}

      <div
        className={`
          flex
          h-full
          items-center
          justify-between
          pr-4
          sm:pr-6
          lg:pr-10
          transition-[padding]
          duration-300
          ease-in-out
          ${
            sidebarOpen
              ? 'pl-4 sm:pl-6 lg:pl-10'
              : 'pl-16 sm:pl-16 lg:pl-16'
          }
        `}
      >
        {/* =====================================================
            SEARCH
            ===================================================== */}

        <div className="relative w-full max-w-md">
          {/* Search Icon */}
          <svg
            className="
              pointer-events-none
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
            aria-hidden="true"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
            />
            <path d="m20 20-3.5-3.5" />
          </svg>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search datasets, tools or help..."
            aria-label="Search datasets, tools or help"
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
              pointer-events-none
              absolute
              right-3
              top-1/2
              hidden
              -translate-y-1/2
              rounded-md
              border
              border-white/8
              bg-white/5
              px-2
              py-1
              text-xs
              text-[#7D89A8]
              sm:block
            "
          >
            Ctrl K
          </span>
        </div>

        {/* =====================================================
            RIGHT SIDE
            ===================================================== */}

        <div className="ml-3 flex shrink-0 items-center gap-2 sm:ml-6 sm:gap-5">
          {/* =====================================================
              DARK / LIGHT MODE
              ===================================================== */}

          <button
            type="button"
            onClick={handleThemeToggle}
            className="
              relative
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-transparent
              text-[#9AA5BF]
              transition-all
              duration-200
              hover:border-white/8
              hover:bg-white/5
              hover:text-white
              focus:outline-none
              focus:ring-2
              focus:ring-[#635BFF]/40
            "
            aria-label={
              isLightMode
                ? 'Switch to dark mode'
                : 'Switch to light mode'
            }
            title={
              isLightMode
                ? 'Switch to dark mode'
                : 'Switch to light mode'
            }
          >
            {isLightMode ? (
              /* Sun */
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.42 1.42" />
                <path d="m17.65 17.65 1.42 1.42" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.35 17.65-1.42 1.42" />
                <path d="m19.07 4.93-1.42 1.42" />
              </svg>
            ) : (
              /* Moon */
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.8 6.8 0 0 0 9.8 9.8Z" />
              </svg>
            )}
          </button>

          {/* =====================================================
              PROFILE
              ===================================================== */}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowProfileMenu((current) => !current)
              }
              className="
                flex
                items-center
                gap-2
                rounded-xl
                px-2
                py-1
                transition-all
                duration-200
                hover:bg-white/6
                focus:outline-none
                focus:ring-2
                focus:ring-[#635BFF]/40
                sm:gap-3
              "
              aria-label="Open profile menu"
              aria-haspopup="menu"
              aria-expanded={showProfileMenu}
            >
              {/* Avatar */}
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
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
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* =====================================================
                PROFILE DROPDOWN
                ===================================================== */}

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
                role="menu"
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
                    focus:outline-none
                    focus:ring-2
                    focus:ring-inset
                    focus:ring-[#635BFF]/40
                  "
                  role="menuitem"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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
                    focus:outline-none
                    focus:ring-2
                    focus:ring-inset
                    focus:ring-red-400/30
                  "
                  role="menuitem"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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