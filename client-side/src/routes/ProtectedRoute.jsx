import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const {
    isAuthenticated,
    loading,
  } = useAuth()

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#020617',
          color: 'white',
        }}
      >
        Loading...
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  if (children) {
    return children
  }

  return <Outlet />
}

export default ProtectedRoute