import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react'
import {
  MemoryRouter,
  Route,
  Routes,
} from 'react-router-dom'

import VehicleDetails from '../VehicleDetails'
import { AuthProvider } from '../../context/AuthContext'

const mockGetCurrentUser = vi.fn()

const mockGetVehicle = vi.fn()
const mockPurchaseVehicle = vi.fn()
const mockRestockVehicle = vi.fn()
const mockDeleteVehicle = vi.fn()

vi.mock('../../services/api', () => ({
  getCurrentUser: (...args) =>
    mockGetCurrentUser(...args),

  loginUser: vi.fn(),

  registerUser: vi.fn(),
}))

vi.mock('../../services/vehicleApi', () => ({
  getVehicle: (...args) =>
    mockGetVehicle(...args),

  purchaseVehicle: (...args) =>
    mockPurchaseVehicle(...args),

  restockVehicle: (...args) =>
    mockRestockVehicle(...args),

  deleteVehicle: (...args) =>
    mockDeleteVehicle(...args),
}))

const vehicle = {
  id: 1,
  make: 'Toyota',
  model: 'Camry',
  category: 'sedan',
  price: 20000,
  quantity: 5,
}

const renderVehicleDetails = () => {
  localStorage.setItem(
    'access_token',
    'test-token',
  )

  return render(
    <MemoryRouter
      initialEntries={['/vehicles/1']}
    >
      <AuthProvider>
        <Routes>
          <Route
            path="/vehicles/:vehicleId"
            element={<VehicleDetails />}
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  )
}

const findVehicleName = async () => {
  expect(
    await screen.findByText('Toyota'),
  ).toBeInTheDocument()

  expect(
    screen.getByText('Camry'),
  ).toBeInTheDocument()
}

describe('VehicleDetails', () => {

  beforeEach(() => {
    vi.clearAllMocks()

    localStorage.clear()

    mockGetCurrentUser.mockResolvedValue({
      id: 1,
      username: 'admin',
      email: 'admin@gmail.com',
      role: 'ADMIN',
    })

    mockGetVehicle.mockResolvedValue(vehicle)

    mockPurchaseVehicle.mockResolvedValue({
      vehicle: {
        ...vehicle,
        quantity: 4,
      },
    })

    mockRestockVehicle.mockResolvedValue({
      vehicle: {
        ...vehicle,
        quantity: 6,
      },
    })

    mockDeleteVehicle.mockResolvedValue({
      message:
        'Vehicle deleted successfully',
    })
  })


  it(
    'loads and displays vehicle details',
    async () => {
      renderVehicleDetails()

      await findVehicleName()

      expect(
        screen.getByText('Toyota'),
      ).toBeInTheDocument()

      expect(
        screen.getByText('Camry'),
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          /₹\s*20,000/,
        ),
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          /Category:\s*sedan/i,
        ),
      ).toBeInTheDocument()

      expect(
        screen.getAllByText(
          /Stock:\s*5/i,
        ),
      ).toHaveLength(2)

      expect(
        screen.getByRole('button', {
          name: /purchase 1/i,
        }),
      ).toBeInTheDocument()
    },
  )


  it(
    'purchases a vehicle and updates quantity',
    async () => {
      renderVehicleDetails()

      await findVehicleName()

      fireEvent.click(
        screen.getByRole('button', {
          name: /purchase 1/i,
        }),
      )

      await waitFor(() => {
        expect(
          mockPurchaseVehicle,
        ).toHaveBeenCalledWith(
          1,
          1,
        )
      })

      await waitFor(() => {
        expect(
          screen.getAllByText(
            /Stock:\s*4/i,
          ),
        ).toHaveLength(2)
      })
    },
  )


  it(
    'restocks a vehicle successfully',
    async () => {
      renderVehicleDetails()

      await findVehicleName()

      fireEvent.click(
        screen.getByRole('button', {
          name: /restock 1/i,
        }),
      )

      await waitFor(() => {
        expect(
          mockRestockVehicle,
        ).toHaveBeenCalledWith(
          1,
          1,
        )
      })

      await waitFor(() => {
        expect(
          screen.getAllByText(
            /Stock:\s*6/i,
          ),
        ).toHaveLength(2)
      })
    },
  )


  it(
    'does not delete when confirmation is cancelled',
    async () => {
      renderVehicleDetails()

      await findVehicleName()

      const confirmSpy =
        vi
          .spyOn(window, 'confirm')
          .mockReturnValue(false)

      fireEvent.click(
        screen.getByRole('button', {
          name: /delete vehicle/i,
        }),
      )

      expect(
        confirmSpy,
      ).toHaveBeenCalled()

      expect(
        mockDeleteVehicle,
      ).not.toHaveBeenCalled()

      confirmSpy.mockRestore()
    },
  )


  it(
    'deletes a vehicle after confirmation',
    async () => {
      renderVehicleDetails()

      await findVehicleName()

      const confirmSpy =
        vi
          .spyOn(window, 'confirm')
          .mockReturnValue(true)

      fireEvent.click(
        screen.getByRole('button', {
          name: /delete vehicle/i,
        }),
      )

      await waitFor(() => {
        expect(
          mockDeleteVehicle,
        ).toHaveBeenCalledWith(
          1,
        )
      })

      expect(
        mockDeleteVehicle,
      ).toHaveBeenCalledTimes(1)

      confirmSpy.mockRestore()
    },
  )


  it(
    'shows an error for an invalid vehicle ID',
    async () => {
      render(
        <MemoryRouter
          initialEntries={[
            '/vehicles/abc',
          ]}
        >
          <AuthProvider>
            <Routes>
              <Route
                path="/vehicles/:vehicleId"
                element={
                  <VehicleDetails />
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>,
      )

      await waitFor(() => {
        expect(
          screen.getByText(
            /Invalid vehicle ID/i,
          ),
        ).toBeInTheDocument()
      })

      expect(
        mockGetVehicle,
      ).not.toHaveBeenCalled()
    },
  )


  it(
    'shows vehicle not found when API returns no vehicle',
    async () => {
      mockGetVehicle.mockResolvedValue(
        null,
      )

      renderVehicleDetails()

      await waitFor(() => {
        expect(
          screen.getByText(
            /Vehicle not found/i,
          ),
        ).toBeInTheDocument()
      })
    },
  )


  /*
   * ERROR HANDLING TESTS
   */


  it(
    'shows an error when loading vehicle fails',
    async () => {
      mockGetVehicle.mockRejectedValue(
        new Error('Failed to load vehicle'),
      )

      renderVehicleDetails()

      await waitFor(() => {
        expect(
          screen.getByText(
            /Failed to load vehicle/i,
          ),
        ).toBeInTheDocument()
      })
    },
  )


  it(
    'shows an error when purchase fails',
    async () => {
      mockPurchaseVehicle.mockRejectedValue(
        new Error('Purchase failed'),
      )

      renderVehicleDetails()

      await findVehicleName()

      fireEvent.click(
        screen.getByRole('button', {
          name: /purchase 1/i,
        }),
      )

      await waitFor(() => {
        expect(
          screen.getByText(
            /Purchase failed/i,
          ),
        ).toBeInTheDocument()
      })
    },
  )


  it(
    'shows an error when restock fails',
    async () => {
      mockRestockVehicle.mockRejectedValue(
        new Error('Restock failed'),
      )

      renderVehicleDetails()

      await findVehicleName()

      fireEvent.click(
        screen.getByRole('button', {
          name: /restock 1/i,
        }),
      )

      await waitFor(() => {
        expect(
          screen.getByText(
            /Restock failed/i,
          ),
        ).toBeInTheDocument()
      })
    },
  )


  it(
    'shows an error when delete fails',
    async () => {
      mockDeleteVehicle.mockRejectedValue(
        new Error('Delete failed'),
      )

      renderVehicleDetails()

      await findVehicleName()

      const confirmSpy =
        vi
          .spyOn(window, 'confirm')
          .mockReturnValue(true)

      fireEvent.click(
        screen.getByRole('button', {
          name: /delete vehicle/i,
        }),
      )

      await waitFor(() => {
        expect(
          screen.getByText(
            /Delete failed/i,
          ),
        ).toBeInTheDocument()
      })

      confirmSpy.mockRestore()
    },
  )

})