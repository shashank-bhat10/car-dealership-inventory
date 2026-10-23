import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import VehicleDetails from '../VehicleDetails'
import { useAuth } from '../../context/AuthContext'
import * as api from '../../services/vehicleApi'

vi.mock('../../context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('../../services/vehicleApi', () => ({
  getVehicle: vi.fn(), updateVehicle: vi.fn(), deleteVehicle: vi.fn(),
  purchaseVehicle: vi.fn(), restockVehicle: vi.fn(),
}))

const vehicle = { id: 1, make: 'Toyota', model: 'Camry', category: 'Sedan', price: 20000, quantity: 5 }

function renderDetails() {
  return render(<MemoryRouter initialEntries={['/vehicles/1']}>
    <Routes><Route path="/vehicles/:vehicleId" element={<VehicleDetails />} /></Routes>
  </MemoryRouter>)
}

async function openEditor() {
  renderDetails()
  fireEvent.click(await screen.findByRole('button', { name: 'Edit vehicle' }))
  return screen.getByRole('form', { name: 'Edit vehicle' })
}

describe('vehicle editing', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    useAuth.mockReturnValue({ user: { role: 'ADMIN' } })
    api.getVehicle.mockResolvedValue(vehicle)
    api.updateVehicle.mockResolvedValue({ ...vehicle, model: 'Corolla' })
  })

  it('prefills all fields and saves admin changes through the update helper', async () => {
    const form = await openEditor()
    expect(screen.getByLabelText('Make')).toHaveValue('Toyota')
    expect(screen.getByLabelText('Model')).toHaveValue('Camry')
    expect(screen.getByLabelText('Category')).toHaveValue('Sedan')
    expect(screen.getByLabelText('Price')).toHaveValue(20000)
    expect(screen.getByLabelText('Quantity')).toHaveValue(5)
    const changes = { Make: ' Honda ', Model: ' Civic ', Category: 'Coupe', Price: '23000.50', Quantity: '0' }
    for (const [label, value] of Object.entries(changes)) {
      fireEvent.change(screen.getByLabelText(label), { target: { value } })
    }
    api.updateVehicle.mockResolvedValue({ ...vehicle, make: 'Honda', model: 'Civic', category: 'Coupe', price: 23000.5, quantity: 0 })
    fireEvent.submit(form)
    await waitFor(() => expect(api.updateVehicle).toHaveBeenCalledWith(1, {
      make: 'Honda', model: 'Civic', category: 'Coupe', price: 23000.5, quantity: 0,
    }))
    expect(await screen.findByRole('status')).toHaveTextContent('Vehicle updated.')
    expect(screen.getByRole('heading', { name: 'Civic', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sold Out' })).toBeDisabled()
    expect(screen.queryByRole('form', { name: 'Edit vehicle' })).not.toBeInTheDocument()
  })

  it('does not expose editing or send updates for a regular user', async () => {
    useAuth.mockReturnValue({ user: { role: 'USER' } })
    renderDetails()
    await screen.findByText('Camry')
    expect(screen.queryByRole('button', { name: 'Edit vehicle' })).not.toBeInTheDocument()
    expect(screen.queryByRole('form', { name: 'Edit vehicle' })).not.toBeInTheDocument()
    expect(api.updateVehicle).not.toHaveBeenCalled()
  })

  it('cancels edits without sending an update', async () => {
    await openEditor()
    fireEvent.change(screen.getByLabelText('Model'), { target: { value: 'Changed' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cancel editing' }))
    expect(screen.queryByRole('form', { name: 'Edit vehicle' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Camry', level: 2 })).toBeInTheDocument()
    expect(api.updateVehicle).not.toHaveBeenCalled()
  })

  it.each([['Make', '   '], ['Price', '0'], ['Price', ''], ['Quantity', '-1'], ['Quantity', '1.5'], ['Quantity', '']])(
    'rejects invalid %s value %j without an API request', async (label, value) => {
      const form = await openEditor()
      fireEvent.change(screen.getByLabelText(label), { target: { value } })
      fireEvent.submit(form)
      expect(await screen.findByRole('alert')).toBeInTheDocument()
      expect(api.updateVehicle).not.toHaveBeenCalled()
    },
  )

  it('keeps edits available after an API error so the admin can retry', async () => {
    api.updateVehicle.mockRejectedValueOnce(new Error('Update failed'))
    const form = await openEditor()
    fireEvent.change(screen.getByLabelText('Model'), { target: { value: 'Corolla' } })
    fireEvent.submit(form)
    expect(await screen.findByRole('alert')).toHaveTextContent('Update failed')
    expect(screen.getByLabelText('Model')).toHaveValue('Corolla')
    fireEvent.submit(form)
    expect(await screen.findByRole('status')).toHaveTextContent('Vehicle updated.')
    expect(api.updateVehicle).toHaveBeenCalledTimes(2)
  })

  it('disables the form while saving and prevents duplicate requests', async () => {
    let resolveUpdate
    api.updateVehicle.mockReturnValue(new Promise(resolve => { resolveUpdate = resolve }))
    const form = await openEditor()
    fireEvent.submit(form)
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled()
    expect(screen.getByLabelText('Model')).toBeDisabled()
    fireEvent.submit(form)
    expect(api.updateVehicle).toHaveBeenCalledTimes(1)
    resolveUpdate(vehicle)
    expect(await screen.findByRole('status')).toHaveTextContent('Vehicle updated.')
  })
})
