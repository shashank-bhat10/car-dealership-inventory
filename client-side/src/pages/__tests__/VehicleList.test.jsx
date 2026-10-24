import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from 'vitest'

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react'

import { MemoryRouter } from 'react-router-dom'

import VehicleList from '../VehicleList'
import { useAuth } from '../../context/AuthContext'

import {
  searchVehicles,
  purchaseVehicle,
} from '../../services/vehicleApi'


/* =========================================================
   MOCKS
========================================================= */

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../services/vehicleApi', () => ({
  searchVehicles: vi.fn(),
  purchaseVehicle: vi.fn(),
}))


/* =========================================================
   TEST DATA
========================================================= */

const mockVehicles = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 25000,
    quantity: 5,
  },
  {
    id: 2,
    make: 'Honda',
    model: 'Civic',
    category: 'Sedan',
    price: 15000,
    quantity: 0,
  },
  {
    id: 3,
    make: 'Tesla',
    model: 'Model 3',
    category: 'Electric',
    price: 45000,
    quantity: 2,
  },
]


/* =========================================================
   RENDER HELPER
========================================================= */

const renderVehicleList = () => {
  return render(
    <MemoryRouter>
      <VehicleList />
    </MemoryRouter>,
  )
}


/* =========================================================
   TESTS
========================================================= */

describe('VehicleList', () => {

  it('requests available inventory from page one when the stock filter changes', async () => {
    searchVehicles.mockResolvedValueOnce(Array.from({ length: 100 }, (_, index) => ({ ...mockVehicles[0], id: index + 1 })))
    renderVehicleList()
    fireEvent.click(await screen.findByRole('button', { name: /next page/i }))
    await waitFor(() => expect(searchVehicles).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 })))
    fireEvent.click(screen.getByRole('button', { name: /in stock only/i }))
    await waitFor(() => expect(searchVehicles).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, in_stock: true })))
  })

  it('can request vehicles beyond the first hundred', async () => {
    searchVehicles.mockResolvedValueOnce(Array.from({ length: 100 }, (_, index) => ({ ...mockVehicles[0], id: index + 1 })))
    renderVehicleList()
    const next = await screen.findByRole('button', { name: /next page/i })
    fireEvent.click(next)
    await waitFor(() => expect(searchVehicles).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 })))
  })

  it('keeps the search field focused during filtering', async () => {
    renderVehicleList()
    const search = await screen.findByPlaceholderText('Search by make or model...')
    search.focus()
    fireEvent.change(search, { target: { value: 'Toy' } })
    expect(search).toHaveFocus()
  })

  it('explains an empty catalog and gives administrators a first-vehicle action', async () => {
    searchVehicles.mockResolvedValueOnce([])
    useAuth.mockReturnValue({ user: { username: 'admin', role: 'ADMIN' } })

    renderVehicleList()

    expect(await screen.findByRole('heading', { name: 'Inventory is empty' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Add the first vehicle' })).toHaveAttribute('href', '/vehicles/add')
  })

  it('offers to clear filters when there are no matching vehicles', async () => {
    searchVehicles.mockResolvedValueOnce([])

    renderVehicleList()
    fireEvent.change(await screen.findByPlaceholderText('Search by make or model...'), {
      target: { value: 'No match' },
    })

    expect(await screen.findByRole('heading', { name: 'No matching vehicles' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(await screen.findByText('Toyota')).toBeInTheDocument()
  })

  beforeEach(() => {
    vi.clearAllMocks()

    searchVehicles.mockImplementation(async (params = {}) => {
      const query = params.q?.toLowerCase() || ''
      return mockVehicles.filter((vehicle) => {
        const text = `${vehicle.make} ${vehicle.model}`.toLowerCase()
        const matchesQuery = text.includes(query)
        const matchesCategory = !params.category ||
          vehicle.category.toLowerCase() === params.category.toLowerCase()
        const matchesMin = params.min_price === '' ||
          vehicle.price >= Number(params.min_price)
        const matchesMax = params.max_price === '' ||
          vehicle.price <= Number(params.max_price)

        return matchesQuery && matchesCategory && matchesMin && matchesMax
      })
    })

    purchaseVehicle.mockResolvedValue({
      message:
        'Vehicle purchased successfully',

      vehicle: {
        ...mockVehicles[0],
        quantity: 4,
      },
    })

    useAuth.mockReturnValue({
      user: {
        username: 'testuser1',
        role: 'USER',
      },
    })
  })


  /* =======================================================
     TEST 1
     LOAD VEHICLES
  ======================================================= */

  it(
    'loads and displays vehicles',
    async () => {

      renderVehicleList()

      expect(
        await screen.findByText('Camry'),
      ).toBeInTheDocument()

      expect(
        screen.getByText('Civic'),
      ).toBeInTheDocument()

      expect(
        screen.getByText('Model 3'),
      ).toBeInTheDocument()
    },
  )


  /* =======================================================
     TEST 2
     SEARCH FILTER
  ======================================================= */

  it(
    'filters vehicles by search text',
    async () => {

      renderVehicleList()

      await screen.findByText('Camry')

      expect(searchVehicles).toHaveBeenCalledWith({
        q: '',
        category: '',
        min_price: '',
        max_price: '',
        page: 1,
        limit: 100,
        in_stock: false,
      })

      const searchInput =
        screen.getByPlaceholderText(
          'Search by make or model...',
        )

      fireEvent.change(
        searchInput,
        {
          target: {
            value: 'Tesla',
          },
        },
      )

      await waitFor(() => {
        expect(screen.getByText('Model 3')).toBeInTheDocument()
        expect(screen.queryByText('Camry')).not.toBeInTheDocument()
        expect(screen.queryByText('Civic')).not.toBeInTheDocument()
      })

      expect(searchVehicles).toHaveBeenLastCalledWith({
        q: 'Tesla',
        category: '',
        min_price: '',
        max_price: '',
        page: 1,
        limit: 100,
        in_stock: false,
      })
    },
  )


  /* =======================================================
     TEST 3
     CATEGORY FILTER
  ======================================================= */

  it(
    'filters vehicles by category',
    async () => {

      renderVehicleList()

      await screen.findByText('Camry')

      fireEvent.click(
        screen.getByRole('button', {
          name: 'Electric',
        }),
      )

      await waitFor(() => {
        expect(screen.getByText('Model 3')).toBeInTheDocument()
        expect(screen.queryByText('Camry')).not.toBeInTheDocument()
        expect(screen.queryByText('Civic')).not.toBeInTheDocument()
      })
    },
  )


  /* =======================================================
     TEST 4
     STOCK FILTER
  ======================================================= */

  it(
    'filters out vehicles with zero stock',
    async () => {

      renderVehicleList()

      await screen.findByText('Camry')

      fireEvent.click(
        screen.getByRole('button', {
          name: '✓ In Stock Only',
        }),
      )

      expect(
        screen.getByText('Camry'),
      ).toBeInTheDocument()

      expect(
        screen.getByText('Model 3'),
      ).toBeInTheDocument()

      expect(
        screen.queryByText('Civic'),
      ).not.toBeInTheDocument()
    },
  )


  /* =======================================================
     TEST 5
     ADMIN ADD VEHICLE
  ======================================================= */

  it(
    'shows Add Vehicle button for admin',
    async () => {

      useAuth.mockReturnValue({
        user: {
          username: 'testuser1',
          role: 'ADMIN',
        },
      })

      renderVehicleList()

      await screen.findByText('Camry')

      expect(
        screen.getByRole('link', {
          name: /Add Vehicle/i,
        }),
      ).toBeInTheDocument()
    },
  )


  /* =======================================================
     TEST 6
     NORMAL USER ADD VEHICLE
  ======================================================= */

  it(
    'does not show Add Vehicle button for normal user',
    async () => {

      useAuth.mockReturnValue({
        user: {
          username: 'customer1',
          role: 'USER',
        },
      })

      renderVehicleList()

      await screen.findByText('Camry')

      expect(
        screen.queryByRole('link', {
          name: /Add Vehicle/i,
        }),
      ).not.toBeInTheDocument()
    },
  )


  /* =======================================================
     TEST 7
     PURCHASE VEHICLE
  ======================================================= */

  it(
    'purchases a vehicle and updates its stock',
    async () => {

      purchaseVehicle.mockResolvedValue({
        message:
          'Vehicle purchased successfully',

        vehicle: {
          ...mockVehicles[0],
          quantity: 4,
        },
      })

      renderVehicleList()

      await screen.findByText('Camry')

      const purchaseButtons =
        screen.getAllByRole(
          'button',
          {
            name: 'Purchase',
          },
        )

      fireEvent.click(
        purchaseButtons[0],
      )

      await waitFor(() => {

        expect(
          purchaseVehicle,
        ).toHaveBeenCalledWith(
          1,
          1,
        )

      })

      await waitFor(() => {

        expect(
          screen.getByText(
            'In Stock: 4',
          ),
        ).toBeInTheDocument()

      })
    },
  )


  /* =======================================================
     TEST 8
     SOLD OUT
  ======================================================= */

  it(
    'disables purchase for out-of-stock vehicles',
    async () => {

      renderVehicleList()

      await screen.findByText('Civic')

      const soldOutButton =
        screen.getByRole(
          'button',
          {
            name: 'Sold Out',
          },
        )

      expect(
        soldOutButton,
      ).toBeDisabled()

      expect(
        purchaseVehicle,
      ).not.toHaveBeenCalled()
    },
  )


  /* =======================================================
     TEST 9
     LOAD ERROR
  ======================================================= */

  it(
    'shows an error when loading vehicles fails',
    async () => {

      searchVehicles.mockRejectedValue(
        new Error(
          'Failed to load vehicles',
        ),
      )

      renderVehicleList()

      await waitFor(() => {

        expect(
          screen.getByText(
            /failed to load vehicles/i,
          ),
        ).toBeInTheDocument()

      })
    },
  )


  /* =======================================================
     TEST 10
     PURCHASE ERROR
  ======================================================= */

  it(
    'shows an error when purchasing a vehicle fails',
    async () => {

      purchaseVehicle.mockRejectedValue(
        new Error(
          'Purchase failed',
        ),
      )

      renderVehicleList()

      await screen.findByText('Camry')

      const purchaseButtons =
        screen.getAllByRole(
          'button',
          {
            name: 'Purchase',
          },
        )

      fireEvent.click(
        purchaseButtons[0],
      )

      expect(
        await screen.findByText(
          /purchase failed/i,
        ),
      ).toBeInTheDocument()
    },
  )


  /* =======================================================
     TEST 11
     PURCHASE FAILURE KEEPS LIST
  ======================================================= */

  it(
    'keeps the vehicle list when purchase fails',
    async () => {

      purchaseVehicle.mockRejectedValue(
        new Error(
          'Purchase failed',
        ),
      )

      renderVehicleList()

      await screen.findByText('Camry')

      const purchaseButtons =
        screen.getAllByRole(
          'button',
          {
            name: 'Purchase',
          },
        )

      fireEvent.click(
        purchaseButtons[0],
      )

      expect(
        await screen.findByText(
          /purchase failed/i,
        ),
      ).toBeInTheDocument()

      expect(
        screen.getByText('Camry'),
      ).toBeInTheDocument()

      expect(
        screen.getByText('Civic'),
      ).toBeInTheDocument()

      expect(
        screen.getByText('Model 3'),
      ).toBeInTheDocument()
    },
  )


  /* =======================================================
     TEST 12
     EMPTY INVENTORY
  ======================================================= */

  it(
    'shows empty inventory when API returns no vehicles',
    async () => {

      searchVehicles.mockResolvedValue([])

      renderVehicleList()

      await waitFor(() => {

        expect(
          screen.queryByText('Camry'),
        ).not.toBeInTheDocument()

        expect(
          screen.queryByText('Civic'),
        ).not.toBeInTheDocument()

        expect(
          screen.queryByText('Model 3'),
        ).not.toBeInTheDocument()

      })
    },
  )

})
