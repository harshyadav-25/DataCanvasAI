import Header from './Header'
import Sidebar from './Sidebar'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Area */}
        <div className="flex-1 min-w-0">

          {/* Top Header */}
          <Header />

          {/* Page Content */}
          <main className="px-6 py-6 lg:px-10">
            {children}
          </main>

        </div>
      </div>
    </div>
  )
}

export default Layout