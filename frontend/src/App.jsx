import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './components/layout/Layout'

import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Overview from './pages/Overview'
import Profiling from './pages/Profiling'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Application */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/upload"
          element={
            <Layout>
              <Upload />
            </Layout>
          }
        />

        <Route
          path="/overview"
          element={
            <Layout>
              <Overview />
            </Layout>
          }
        />

        <Route
          path="/profiling"
          element={
            <Layout>
              <Profiling />
            </Layout>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App