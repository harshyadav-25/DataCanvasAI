import { Link } from 'react-router-dom'

function Header() {
  return (
    <header
      className="
        fixed
        left-[208px]
        right-0
        top-0
        z-50
        h-[68px]
        border-b
        border-white/[0.08]
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
              border-white/[0.08]
              bg-white/[0.04]
              pl-10
              pr-16
              text-sm
              text-white
              placeholder:text-[#66728F]
              outline-none
              backdrop-blur-md
              transition
              focus:border-[#635BFF]/60
              focus:bg-white/[0.06]
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
              border-white/[0.08]
              bg-white/[0.05]
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
              GUEST PROFILE
              ========================================= */}

          <Link
            to="/login"
            className="
              flex
              items-center
              gap-3
              rounded-xl
              px-2
              py-1
              transition-all
              duration-200
              hover:bg-white/[0.06]
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
                bg-gradient-to-br
                from-[#5148D8]
                to-[#7C5CFF]
                text-sm
                font-semibold
                text-white
                shadow-[0_0_20px_rgba(81,72,216,0.25)]
              "
            >
              G
            </div>

            {/* User Info */}

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-white">
                Guest
              </p>

              <p className="text-xs text-[#7D89A8]">
                Sign in
              </p>
            </div>

            {/* Arrow */}

            <svg
              className="h-4 w-4 text-[#7885A4]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Link>

        </div>
      </div>
    </header>
  )
}

export default Header