import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'

import Landing from './pages/Landing'
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

        {/* =========================
            PUBLIC LANDING PAGE
            ========================= */}
        <Route
          path="/"
          element={<Landing />}
        />

        {/* =========================
            AUTHENTICATION
            ========================= */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================
            PROTECTED DASHBOARD
            ========================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* =========================
            PROTECTED UPLOAD
            ========================= */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Layout>
                <Upload />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* =========================
            PROTECTED OVERVIEW
            ========================= */}
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <Layout>
                <Overview />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* =========================
            PROTECTED PROFILING
            ========================= */}
        <Route
          path="/profiling"
          element={
            <ProtectedRoute>
              <Layout>
                <Profiling />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* =========================
            FUTURE PROTECTED PAGES
            ========================= */}
        <Route
          path="/canvas"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="p-6 text-white">
                  Preprocessing
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/visualization"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="p-6 text-white">
                  Visualization
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/modeling"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="p-6 text-white">
                  Modeling
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="p-6 text-white">
                  History
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App