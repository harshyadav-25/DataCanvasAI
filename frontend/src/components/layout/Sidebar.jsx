import { NavLink } from 'react-router-dom'

function Sidebar() {
  const menuItems = [
    { name: 'Home', path: '/dashboard' },
    { name: 'Upload', path: '/upload' },
    { name: 'Data Preview', path: '/overview' },
    { name: 'Preprocessing', path: '/canvas' },
    { name: 'Visualization', path: '/visualization' },
    { name: 'Modeling', path: '/modeling' },
    { name: 'History', path: '/history' },
  ]

  return (
    <aside className="w-[208px] shrink-0 min-h-screen bg-white border-r border-[#E5E7F0] flex flex-col">

      {/* Logo */}
      <div className="h-[68px] px-5 flex items-center border-b border-[#F0F1F6]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EEF0FF] flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#5B56E8]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <ellipse cx="12" cy="5" rx="7" ry="3" />
              <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
              <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
            </svg>
          </div>

          <span className="font-bold text-[#5B56E8] text-lg">
            DataCanvasAI
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-[#EEF0FF] text-[#5B56E8]'
                  : 'text-[#667085] hover:bg-[#F7F8FC] hover:text-[#17213A]'
              }`
            }
          >
            <span className="w-2 h-2 rounded-full bg-current opacity-60" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Card */}
      <div className="mt-auto p-3">
        <div className="rounded-xl bg-[#F3F1FF] border border-[#E1DEFF] p-4">

          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#5B56E8]">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v18M3 12h18" />
            </svg>
          </div>

          <p className="mt-3 text-sm font-semibold text-[#17213A]">
            Turn your data into insights.
          </p>

          <p className="mt-1 text-xs leading-5 text-[#667085]">
            Simple tools. Smarter decisions.
          </p>

          <div className="mt-3 text-[#5B56E8] text-lg">
            →
          </div>
        </div>
      </div>

    </aside>
  )
}

export default Sidebar