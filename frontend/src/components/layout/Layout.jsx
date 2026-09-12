import Header from './Header'
import Sidebar from './Sidebar'
import DataPipeline3D from '../DataPipeline3D'

function Layout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050816] text-white">

      {/* =========================================
          GLOBAL 3D BACKGROUND
          ========================================= */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        {/* Blue Glow */}
        <div className="absolute -right-[15%] -top-[15%] h-[850px] w-[850px] rounded-full bg-[#3158FF]/20 blur-[180px]" />

        {/* Purple Glow */}
        <div className="absolute -left-[15%] top-[20%] h-[750px] w-[750px] rounded-full bg-[#7C3AED]/15 blur-[170px]" />

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

      {/* =========================================
          APPLICATION CONTENT
          ========================================= */}
      <div className="relative z-10 min-h-screen">

        {/* =========================================
            FIXED SIDEBAR
            ========================================= */}
        <Sidebar />

        {/* =========================================
            MAIN CONTENT
            ========================================= */}
        <div className="ml-[208px] flex min-h-screen min-w-0 flex-col">

          {/* Header */}
          <div className="relative z-30">
            <Header />
          </div>

          {/* Page Content */}
          <main className="relative z-10 flex-1 px-6 pb-6 pt-[92px] lg:px-10">
            {children}
          </main>

        </div>
      </div>
    </div>
  )
}

export default Layout