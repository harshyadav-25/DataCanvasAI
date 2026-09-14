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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Application */}

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

        {/* ML Risk Auditor */}
        <Route
          path="/risks"
          element={
            <Layout>
              <Risks />
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

      </Routes>
    </BrowserRouter>
  )
}

export default App