import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import AddVehicle from './pages/AddVehicle'
import VehicleList from './pages/VehicleList'
import VehicleDetails from './pages/VehicleDetails'
import AdminRoute from './routes/AdminRoute'

import ProtectedRoute from './routes/ProtectedRoute'
import { useAuth } from './context/AuthContext'

import Navbar from './components/Navbar'


function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center px-3 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
            AutoVault Dashboard
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Welcome, {user?.username}
          </h1>

          <p className="mt-3 text-slate-400">
            Manage your vehicle inventory and account.
          </p>
        </div>

        {/* User Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Username
            </p>

            <h2 className="mt-3 text-xl font-bold text-white">
              {user?.username}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Email
            </p>

            <h2 className="mt-3 text-xl font-bold text-white break-all">
              {user?.email}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Role
            </p>

            <h2 className="mt-3 text-xl font-black text-indigo-400">
              {user?.role}
            </h2>
          </div>

        </div>

      </div>

    </div>
  )
}


function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  return (
    <BrowserRouter>

      {/* Show Navbar only after authentication */}
      {isAuthenticated && <Navbar />}

      <Routes>

        {/* ==============================
            PUBLIC ROUTES
        =============================== */}

        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <Login />
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <Register />
          }
        />


        {/* ==============================
            DASHBOARD
        =============================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* ==============================
            VEHICLES
        =============================== */}

        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <VehicleList />
            </ProtectedRoute>
          }
        />


        {/* ==============================
            ADD VEHICLE
        =============================== */}

        <Route
          path="/vehicles/add"
          element={
            <AdminRoute>
              <AddVehicle />
            </AdminRoute>
          }
        />


        {/* ==============================
            VEHICLE DETAILS
        =============================== */}

        <Route
          path="/vehicles/:vehicleId"
          element={
            <ProtectedRoute>
              <VehicleDetails />
            </ProtectedRoute>
          }
        />


        {/* ==============================
            DEFAULT
        =============================== */}

        <Route
          path="/"
          element={
            <Navigate
              to={
                isAuthenticated
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />


        {/* ==============================
            UNKNOWN ROUTE
        =============================== */}

        <Route
          path="*"
          element={
            <Navigate
              to={
                isAuthenticated
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App