import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import ProtectedRoute from '../ProtectedRoute'
import { useAuth } from '../../context/AuthContext'

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

describe('ProtectedRoute', () => {
  it('shows loading while authentication is being checked', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true,
    })

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    )

    expect(
      screen.getByText('Loading...'),
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Protected Content'),
    ).not.toBeInTheDocument()
  })

  it('allows an authenticated user to access protected content', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
    })

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    )

    expect(
      screen.getByText('Protected Content'),
    ).toBeInTheDocument()
  })

  it('redirects an unauthenticated user to login', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
    })

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    )

    expect(
      screen.queryByText('Protected Content'),
    ).not.toBeInTheDocument()
  })
})