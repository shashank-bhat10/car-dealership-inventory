import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Login from '../Login'
import Register from '../Register'

const { login, register } = vi.hoisted(() => ({ login: vi.fn(), register: vi.fn() }))
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ login, register }) }))

function show(Page) {
  render(<MemoryRouter><Routes>
    <Route path="/" element={<Page />} />
    <Route path="/dashboard" element={<p>Inventory home</p>} />
    <Route path="/login" element={<p>Sign in next</p>} />
  </Routes></MemoryRouter>)
}

beforeEach(() => vi.resetAllMocks())

describe('authentication forms', () => {
  it('logs in and opens the dashboard', async () => {
    login.mockResolvedValue({ username: 'shashank' })
    show(Login)
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'shashank@example.com' } })
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'Example123!' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText('Inventory home')).toBeInTheDocument()
    expect(login).toHaveBeenCalledWith({ email: 'shashank@example.com', password: 'Example123!' })
  })

  it('shows a failed login and allows retry', async () => {
    login.mockRejectedValue(new Error('Invalid email or password'))
    show(Login)
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'shashank@example.com' } })
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'Example123!' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeEnabled()
  })

  it('registers a regular account without sending a role', async () => {
    register.mockResolvedValue({ id: 1 })
    show(Register)
    fireEvent.change(screen.getByLabelText(/^username/i), { target: { value: 'shashank' } })
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'shashank@example.com' } })
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'Example123!' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => expect(register).toHaveBeenCalledWith({ username: 'shashank', email: 'shashank@example.com', password: 'Example123!' }))
    expect(await screen.findByText(/account created successfully/i)).toBeInTheDocument()
  })

  it('does not advertise unsupported usage or uptime statistics', () => {
    show(Login)
    expect(screen.queryByText('99.9%')).not.toBeInTheDocument()
    expect(screen.queryByText('1.2K')).not.toBeInTheDocument()
  })
})
