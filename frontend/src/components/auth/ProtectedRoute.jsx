import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const location = useLocation()

  const isAuthenticated =
    localStorage.getItem('datacanvas_auth') === 'true'

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search,
        }}
      />
    )
  }

  return children
}

export default ProtectedRoute