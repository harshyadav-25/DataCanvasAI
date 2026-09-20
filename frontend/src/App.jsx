
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'

import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Overview from './pages/Overview'
import Profiling from './pages/Profiling'
import DataCanvas from './pages/DataCanvas'
import Risks from './pages/Risks'
import Recommendations from './pages/Recommendations'
import ExperimentsPage from './pages/ExperimentsPage'
import ValidationPage from './pages/ValidationPage'
import HistoryPage from './pages/HistoryPage'
import ReadinessPage from './pages/ReadinessPage'
import PipelinePage from './pages/PipelinePage'
import ReportPage from './pages/ReportPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================================
            PUBLIC LANDING PAGE
            ========================================= */}

        <Route
          path="/"
          element={<Landing />}
        />

        {/* =========================================
            AUTHENTICATION
            ========================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================================
            PROTECTED APPLICATION
            ========================================= */}

        {/* Dashboard / Home */}

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

        {/* Upload */}

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

        {/* Data Preview / Overview */}

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

        {/* Profiling */}

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

        {/* Dataset Canvas / Preprocessing */}

        <Route
          path="/canvas"
          element={
            <ProtectedRoute>
              <Layout>
                <DataCanvas />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ML Risk Auditor */}

        <Route
          path="/risks"
          element={
            <ProtectedRoute>
              <Layout>
                <Risks />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Recommendations */}

        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Layout>
                <Recommendations />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* =========================================
            TASK 4 — WHAT-IF SIMULATOR
            ========================================= */}

        <Route
          path="/experiments"
          element={
            <ProtectedRoute>
              <Layout>
                <ExperimentsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* =========================================
            TASK 5 — VALIDATION
            ========================================= */}

        <Route
          path="/validation"
          element={
            <ProtectedRoute>
              <Layout>
                <ValidationPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* =========================================
            TASK 6 — HISTORY
            ========================================= */}

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <HistoryPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* =========================================
            TASK 7 — READINESS
            ========================================= */}

        <Route
          path="/readiness"
          element={
            <ProtectedRoute>
              <Layout>
                <ReadinessPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* =========================================
            TASK 8 — PIPELINE / CODE
            ========================================= */}

        <Route
          path="/pipeline"
          element={
            <ProtectedRoute>
              <Layout>
                <PipelinePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* =========================================
            TASK 9 — REPORT
            ========================================= */}

        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <Layout>
                <ReportPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* =========================================
            FUTURE APPLICATION MODULES
            ========================================= */}

        {/* Visualization */}

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

        {/* Modeling */}

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

      </Routes>
    </BrowserRouter>
  )
}

export default App
