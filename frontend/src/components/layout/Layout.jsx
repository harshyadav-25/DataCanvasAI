import { useState } from 'react'

import Header from './Header'
import Sidebar from './Sidebar'
import DataPipeline3D from '../DataPipeline3D'

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen((current) => !current)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050816] text-white">
      {/* =====================================================
          GLOBAL 3D BACKGROUND
          ===================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Blue Glow */}
        <div className="absolute -top-[15%] -right-[15%] h-[850px] w-[850px] rounded-full bg-[#3158FF]/20 blur-[180px]" />

        {/* Purple Glow */}
        <div className="absolute top-[20%] -left-[15%] h-[750px] w-[750px] rounded-full bg-[#7C3AED]/15 blur-[170px]" />

        {/* Bottom Blue Glow */}
        <div className="absolute bottom-[-20%] left-[25%] h-[700px] w-[700px] rounded-full bg-[#2563EB]/10 blur-[160px]" />

        {/* 3D Scene */}
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
        <div className="absolute inset-0 bg-[#050816]/25" />
      </div>

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* =====================================================
          SIDEBAR TOGGLE BUTTON
          ===================================================== */}

      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={
          isSidebarOpen ? 'Close sidebar' : 'Open sidebar'
        }
        className={`
          fixed
          top-5
          z-[100]
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          border
          border-white/10
          bg-[#090E1D]/95
          text-white
          shadow-[0_10px_30px_rgba(0,0,0,0.45)]
          backdrop-blur-xl
          transition-all
          duration-300
          ease-in-out
          hover:bg-[#151D35]
          ${isSidebarOpen ? 'left-[190px]' : 'left-4'}
        `}
      >
        {isSidebarOpen ? (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
          </svg>
        ) : (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        )}
      </button>

      {/* =====================================================
          APPLICATION CONTENT
          ===================================================== */}

      <div className="relative z-10 min-h-screen">
        <div
          className={`
            flex
            min-h-screen
            min-w-0
            flex-col
            transition-all
            duration-300
            ease-in-out
            ${isSidebarOpen ? 'lg:ml-[208px]' : 'lg:ml-0'}
          `}
        >
          {/* Header */}
          <div className="relative z-30">
            <Header sidebarOpen={isSidebarOpen} />
          </div>

          {/* Page Content */}
          <main className="relative z-10 flex-1 px-4 pt-[92px] pb-6 sm:px-6 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout