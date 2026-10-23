import {
  Car,
  LogOut,
  Shield,
  User,
  PlusCircle,
  LayoutDashboard,
  CarFront,
} from 'lucide-react'

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'


export default function Navbar() {
  const {
    user,
    logout,
  } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isAdmin = user?.role === 'ADMIN'

  return (
    <nav className="autovault-navbar">

      {/* BRAND */}

      <Link
        to="/dashboard"
        className="brand"
      >
        <div className="brand-icon">
          <Car />
        </div>

        <div>
          <span className="brand-name">
            AUTOVAULT
          </span>

          <span className="brand-subtitle">
            INVENTORY HUB
          </span>
        </div>
      </Link>


      {/* CENTER NAVIGATION */}

      {user && (
        <div className="nav-center">

          <Link
            to="/dashboard"
            className={`nav-link ${
              location.pathname === '/dashboard'
                ? 'active'
                : ''
            }`}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
              }}
            >
              <LayoutDashboard size={15} />
              Dashboard
            </span>
          </Link>


          <Link
            to="/vehicles"
            className={`nav-link ${
              location.pathname.startsWith('/vehicles') &&
              location.pathname !== '/vehicles/add'
                ? 'active'
                : ''
            }`}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
              }}
            >
              <CarFront size={15} />
              Vehicles
            </span>
          </Link>


          {/* ADMIN ONLY */}

          {isAdmin && (
            <Link
              to="/vehicles/add"
              className={`nav-link ${
                location.pathname === '/vehicles/add'
                  ? 'active'
                  : ''
              }`}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                }}
              >
                <PlusCircle size={15} />
                Add Vehicle
              </span>
            </Link>
          )}

        </div>
      )}


      {/* RIGHT */}

      <div className="nav-right">

        {user && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >

              {isAdmin ? (
                <span className="role-badge">
                  <Shield
                    size={12}
                    style={{
                      display: 'inline',
                      marginRight: '5px',
                    }}
                  />
                  ADMIN
                </span>
              ) : (
                <span className="role-badge">
                  <User
                    size={12}
                    style={{
                      display: 'inline',
                      marginRight: '5px',
                    }}
                  />
                  USER
                </span>
              )}

            </div>


            <span
              style={{
                color: '#cbd5e1',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              {user.username}
            </span>


            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              <LogOut
                size={14}
                style={{
                  display: 'inline',
                  marginRight: '6px',
                }}
              />
              Logout
            </button>

          </>
        )}

      </div>

    </nav>
  )
}