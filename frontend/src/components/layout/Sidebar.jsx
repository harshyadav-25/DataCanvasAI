import { NavLink } from 'react-router-dom'

function Sidebar() {
  const menuItems = [
    {
      name: 'Home',
      path: '/dashboard',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9 21v-7h6v7" />
        </svg>
      ),
    },

    {
      name: 'Upload',
      path: '/upload',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M12 16V4" />
          <path d="M7 9l5-5 5 5" />
          <path d="M5 20h14" />
        </svg>
      ),
    },

    {
      name: 'Data Preview',
      path: '/overview',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18" />
          <path d="M8 9v11" />
          <path d="M13 13h5" />
          <path d="M13 16h5" />
        </svg>
      ),
    },

    {
      name: 'Profiling',
      path: '/profiling',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M7 15l4-5 3 3 5-7" />
        </svg>
      ),
    },

    {
      name: 'Preprocessing',
      path: '/canvas',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M4 6h16" />
          <path d="M7 12h10" />
          <path d="M10 18h4" />
          <circle cx="8" cy="6" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="11" cy="18" r="1.5" />
        </svg>
      ),
    },

    /* =====================================================
       TASK 2 — ML RISK AUDITOR
       ===================================================== */
    {
      name: 'Risk Auditor',
      path: '/risks',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M12 3l8 4v5c0 4.8-3.4 8.1-8 9-4.6-.9-8-4.2-8-9V7l8-4z" />
          <path d="M12 8v5" />
          <circle
            cx="12"
            cy="16.5"
            r="0.8"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      ),
    },

    /* =====================================================
       TASK 3 — RECOMMENDATIONS
       ===================================================== */
    {
      name: 'Recommendations',
      path: '/recommendations',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M9 18h6" />
          <path d="M10 21h4" />
          <path d="M8.5 14.5C7.6 13.7 7 12.5 7 11a5 5 0 1 1 10 0c0 1.5-.6 2.7-1.5 3.5-.7.6-1.2 1.4-1.3 2.5h-2.4c-.1-1.1-.6-1.9-1.3-2.5Z" />
        </svg>
      ),
    },

    {
      name: 'Visualization',
      path: '/visualization',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M7 15l4-5 3 3 5-7" />
        </svg>
      ),
    },

    {
      name: 'Modeling',
      path: '/modeling',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <circle cx="9" cy="9" r="1.5" />
          <circle cx="15" cy="9" r="1.5" />
          <circle cx="9" cy="15" r="1.5" />
          <circle cx="15" cy="15" r="1.5" />
          <path d="M9 10.5v3" />
          <path d="M15 10.5v3" />
          <path d="M10.5 9h3" />
          <path d="M10.5 15h3" />
        </svg>
      ),
    },

    {
      name: 'History',
      path: '/history',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 5v5h5" />
          <path d="M12 7v5l3 2" />
        </svg>
      ),
    },
  ]

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-40
        flex
        h-screen
        w-[208px]
        shrink-0
        flex-col
        overflow-hidden
        border-r
        border-white/[0.08]
        bg-[#050816]/30
        text-white
        backdrop-blur-xl
      "
    >
      {/* =====================================================
          LOGO SECTION
          ===================================================== */}

      <div
        className="
          shrink-0
          border-b
          border-white/[0.07]
          px-5
          py-5
        "
      >
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
            <p className="text-lg font-bold leading-tight text-white">
              DataCanvas<span className="text-[#8D89FF]">AI</span>
            </p>

            <p className="mt-0.5 whitespace-nowrap text-[8px] text-slate-400">
              Clean Data. Smarter Models.
            </p>
          </div>

        </div>
      </div>


      {/* =====================================================
          NAVIGATION
          ===================================================== */}

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">

        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `
                group
                flex
                items-center
                gap-3
                rounded-xl
                border
                px-3
                py-2.5
                text-sm
                font-semibold
                transition-all
                duration-200

                ${
                  isActive
                    ? `
                      border-[#756BFF]/30
                      bg-gradient-to-r
                      from-[#5148D8]/30
                      to-[#756BFF]/15
                      text-white
                      shadow-[0_0_20px_rgba(81,72,216,0.12)]
                    `
                    : `
                      border-transparent
                      text-white
                      hover:bg-white/[0.06]
                      hover:text-white
                    `
                }
              `
            }
          >
            {/* Menu Icon */}
            <span
              className="
                flex
                h-5
                w-5
                shrink-0
                items-center
                justify-center
                text-white
                opacity-90
                transition-all
                duration-200
                group-hover:opacity-100
              "
            >
              {item.icon}
            </span>

            {/* Menu Name */}
            <span className="text-white">
              {item.name}
            </span>
          </NavLink>
        ))}

      </nav>
    </aside>
  )
}

export default Sidebar