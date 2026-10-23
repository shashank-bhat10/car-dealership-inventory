import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AdminRoute({ children }) {
  const {
    user,
    loading,
    isAuthenticated,
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

  const isAdmin =
    user?.role?.toUpperCase() === 'ADMIN'

  if (!isAdmin) {
    return (
      <Navigate
        to="/vehicles"
        replace
      />
    )
  }

  return children
}

export default AdminRoute