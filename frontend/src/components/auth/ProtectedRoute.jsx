import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const location = useLocation()

  const isAuthenticated =
    Boolean(localStorage.getItem('datacanvas_access_token'))

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