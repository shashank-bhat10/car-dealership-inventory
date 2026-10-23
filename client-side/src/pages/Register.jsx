import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail,
  Lock,
  User,
  Car,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Users,
  Activity,
  Star,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!username.trim()) {
      setError('Username is required.')
      return
    }

    if (!email.trim()) {
      setError('Email address is required.')
      return
    }

    if (!password) {
      setError('Password is required.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    try {
      setLoading(true)

      /*
       * Public registration.
       *
       * Do NOT send a role from the frontend.
       * The backend determines the default role.
       */

      await register({
        username: username.trim(),
        email: email.trim(),
        password,
      })

      setSuccess(
        'Account created successfully. Redirecting to login...'
      )

      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch (error) {
      setError(
        error.message ||
          'Unable to create your account. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">

      <div className="min-h-screen lg:grid lg:grid-cols-[3fr_2fr]">

        {/* =====================================================
            LEFT — DEALERSHIP SHOWCASE
        ===================================================== */}

        <section className="relative hidden overflow-hidden lg:flex">

          {/* Background */}

          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-950 to-slate-950" />

          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(#334155 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* Glow */}

          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-3xl" />

          {/* Content */}

          <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-10 xl:p-14">

            {/* Brand */}

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-500/10 text-indigo-400 shadow-lg shadow-indigo-500/10">
                <Car size={24} />
              </div>

              <div>
                <div className="text-lg font-black tracking-[0.25em] text-white">
                  AUTOVAULT
                </div>

                <div className="text-[10px] font-medium tracking-[0.25em] text-slate-500">
                  DEALERSHIP INTELLIGENCE
                </div>
              </div>

            </div>


            {/* Hero */}

            <div className="max-w-2xl">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold tracking-wider text-indigo-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
                JOIN THE PLATFORM
              </div>

              <h1 className="text-6xl font-black leading-[0.95] tracking-tight text-white xl:text-7xl">

                BUILD YOUR

                <span className="block bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  DRIVE.
                </span>

              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 xl:text-lg">
                Create your AutoVault account and experience
                modern dealership inventory management from
                one intelligent workspace.
              </p>


              {/* Stats */}

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">

                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 backdrop-blur-xl">

                  <div className="flex items-center gap-2 text-indigo-400">
                    <Car size={16} />
                    <span className="text-xs text-slate-500">
                      Fleet
                    </span>
                  </div>

                  <strong className="mt-2 block text-2xl font-bold text-white">
                    24+
                  </strong>

                  <span className="text-xs text-slate-500">
                    Vehicles
                  </span>

                </div>


                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 backdrop-blur-xl">

                  <div className="flex items-center gap-2 text-emerald-400">
                    <Users size={16} />
                    <span className="text-xs text-slate-500">
                      Units
                    </span>
                  </div>

                  <strong className="mt-2 block text-2xl font-bold text-white">
                    1.2K
                  </strong>

                  <span className="text-xs text-slate-500">
                    Managed
                  </span>

                </div>


                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 backdrop-blur-xl">

                  <div className="flex items-center gap-2 text-amber-400">
                    <Activity size={16} />
                    <span className="text-xs text-slate-500">
                      Uptime
                    </span>
                  </div>

                  <strong className="mt-2 block text-2xl font-bold text-white">
                    99.9%
                  </strong>

                  <span className="text-xs text-slate-500">
                    Availability
                  </span>

                </div>

              </div>


              {/* Features */}

              <div className="mt-8 grid gap-3 sm:grid-cols-2">

                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <CheckCircle2
                    size={17}
                    className="text-emerald-400"
                  />
                  Manage vehicle inventory
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <CheckCircle2
                    size={17}
                    className="text-emerald-400"
                  />
                  Track stock in real time
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <ShieldCheck
                    size={17}
                    className="text-indigo-400"
                  />
                  Secure role-based access
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Star
                    size={17}
                    className="text-amber-400"
                  />
                  Built for modern dealerships
                </div>

              </div>

            </div>


            {/* Footer */}

            <div className="text-xs text-slate-600">
              © 2026 AutoVault · Secure dealership platform
            </div>

          </div>

        </section>


        {/* =====================================================
            RIGHT — REGISTER
        ===================================================== */}

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-8 sm:px-8">

          {/* Mobile background */}

          <div className="absolute inset-0 lg:hidden">

            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-950 to-slate-950" />

            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(#334155 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />

          </div>


          {/* Mobile brand */}

          <div className="absolute left-5 top-6 flex items-center gap-3 lg:hidden">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-400/30 bg-indigo-500/10 text-indigo-400">
              <Car size={19} />
            </div>

            <div className="text-sm font-black tracking-[0.2em] text-white">
              AUTOVAULT
            </div>

          </div>


          {/* Form */}

          <div className="relative z-10 w-full max-w-md">

            {/* Tabs */}

            <div className="mb-8 flex rounded-xl border border-slate-800 bg-slate-900/70 p-1.5 backdrop-blur-xl">

              <Link
                to="/login"
                className="flex flex-1 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:text-white"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="flex flex-1 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
              >
                Create Account
              </Link>

            </div>


            {/* Header */}

            <div className="mb-7">

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                <User size={21} />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Join AutoVault and manage your automotive
                experience.
              </p>

            </div>


            {/* Error */}

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">

                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span>{error}</span>

              </div>
            )}


            {/* Success */}

            {success && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">

                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span>{success}</span>

              </div>
            )}


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Username */}

              <div>

                <label
                  htmlFor="username"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                >
                  Username
                </label>

                <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/80 px-4 transition-all focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20">

                  <User
                    size={18}
                    className="mr-3 shrink-0 text-slate-500"
                  />

                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) =>
                      setUsername(event.target.value)
                    }
                    placeholder="Choose a username"
                    disabled={loading}
                    autoComplete="username"
                    className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                </div>

              </div>


              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                >
                  Email address
                </label>

                <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/80 px-4 transition-all focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20">

                  <Mail
                    size={18}
                    className="mr-3 shrink-0 text-slate-500"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    disabled={loading}
                    autoComplete="email"
                    className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                </div>

              </div>


              {/* Password */}

              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                >
                  Password
                </label>

                <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/80 px-4 transition-all focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20">

                  <Lock
                    size={18}
                    className="mr-3 shrink-0 text-slate-500"
                  />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Create a secure password"
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    className="ml-2 shrink-0 text-slate-500 transition hover:text-white disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>


              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-indigo-600/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}

              </button>

            </form>


            {/* Login */}

            <div className="mt-7 text-center text-sm">

              <span className="text-slate-500">
                Already have an account?{' '}
              </span>

              <Link
                to="/login"
                className="font-semibold text-indigo-400 transition hover:text-indigo-300"
              >
                Sign in
              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>
  )
}

export default Register