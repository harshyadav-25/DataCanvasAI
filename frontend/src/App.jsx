import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './components/layout/Layout'

import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Overview from './pages/Overview'
import Profiling from './pages/Profiling'
import Login from './pages/Login'
import Register from './pages/Register'
import DataCanvas from './pages/DataCanvas'
import Risks from './pages/Risks'
import Recommendations from './pages/Recommendations'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            AUTHENTICATION
        ====================================================== */}

        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />


        {/* =====================================================
            APPLICATION
        ====================================================== */}

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />


        {/* Upload */}
        <Route
          path="/upload"
          element={
            <Layout>
              <Upload />
            </Layout>
          }
        />


        {/* Dataset Canvas */}
        <Route
          path="/canvas"
          element={
            <Layout>
              <DataCanvas />
            </Layout>
          }
        />


        {/* Data Overview */}
        <Route
          path="/overview"
          element={
            <Layout>
              <Overview />
            </Layout>
          }
        />


        {/* Profiling */}
        <Route
          path="/profiling"
          element={
            <Layout>
              <Profiling />
            </Layout>
          }
        />


        {/* ML Risk Auditor - Task 2 */}
        <Route
          path="/risks"
          element={
            <Layout>
              <Risks />
            </Layout>
          }
        />


        {/* Recommendations - Task 3 */}
        <Route
          path="/recommendations"
          element={
            <Layout>
              <Recommendations />
            </Layout>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App