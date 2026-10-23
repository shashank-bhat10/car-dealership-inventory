import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import AddVehicle from '../AddVehicle'
import { createVehicle } from '../../services/vehicleApi'

vi.mock('../../services/vehicleApi', () => ({
  createVehicle: vi.fn(),
}))

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderAddVehicle = () => {
  return render(
    <MemoryRouter>
      <AddVehicle />
    </MemoryRouter>,
  )
}

const fillValidForm = () => {
  fireEvent.change(
    screen.getByPlaceholderText(/e.g. toyota/i),
    {
      target: { value: 'Toyota' },
    },
  )

  fireEvent.change(
    screen.getByPlaceholderText(/e.g. camry/i),
    {
      target: { value: 'Camry' },
    },
  )

  fireEvent.change(
    screen.getByRole('combobox'),
    {
      target: { value: 'Sedan' },
    },
  )

  fireEvent.change(
    screen.getByPlaceholderText('25000'),
    {
      target: { value: '25000' },
    },
  )

  fireEvent.change(
    screen.getByPlaceholderText('5'),
    {
      target: { value: '5' },
    },
  )
}

describe('AddVehicle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the Add Vehicle page', () => {
    renderAddVehicle()

    expect(
      screen.getByRole('heading', {
        name: /add vehicle/i,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        /add a new vehicle to the autovault inventory/i,
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText(/vehicle information/i),
    ).toBeInTheDocument()
  })

  it('renders all vehicle form fields', () => {
    renderAddVehicle()

    expect(
      screen.getByPlaceholderText(/e.g. toyota/i),
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(/e.g. camry/i),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('combobox'),
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText('25000'),
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText('5'),
    ).toBeInTheDocument()
  })

  it('allows the user to enter vehicle information', () => {
    renderAddVehicle()

    const makeInput =
      screen.getByPlaceholderText(/e.g. toyota/i)

    const modelInput =
      screen.getByPlaceholderText(/e.g. camry/i)

    const categoryInput =
      screen.getByRole('combobox')

    const priceInput =
      screen.getByPlaceholderText('25000')

    const quantityInput =
      screen.getByPlaceholderText('5')

    fireEvent.change(makeInput, {
      target: { value: 'Toyota' },
    })

    fireEvent.change(modelInput, {
      target: { value: 'Camry' },
    })

    fireEvent.change(categoryInput, {
      target: { value: 'Sedan' },
    })

    fireEvent.change(priceInput, {
      target: { value: '25000' },
    })

    fireEvent.change(quantityInput, {
      target: { value: '5' },
    })

    expect(makeInput).toHaveValue('Toyota')
    expect(modelInput).toHaveValue('Camry')
    expect(categoryInput).toHaveValue('Sedan')
    expect(priceInput).toHaveValue(25000)
    expect(quantityInput).toHaveValue(5)
  })

  it('shows validation error when required fields are empty', async () => {
    renderAddVehicle()

    const form = screen
      .getByRole('button', {
        name: /add vehicle/i,
      })
      .closest('form')

    fireEvent.submit(form)

    expect(
      await screen.findByText(
        /please fill in all required fields/i,
      ),
    ).toBeInTheDocument()

    expect(createVehicle).not.toHaveBeenCalled()
  })

  it('shows validation error for invalid price', async () => {
    renderAddVehicle()

    fillValidForm()

    const priceInput =
      screen.getByPlaceholderText('25000')

    // Disable native browser validation for this test.
    priceInput.removeAttribute('min')

    fireEvent.input(priceInput, {
      target: { value: '-100' },
    })

    expect(priceInput).toHaveValue(-100)

    const form = screen
      .getByRole('button', {
        name: /add vehicle/i,
      })
      .closest('form')

    fireEvent.submit(form)

    expect(
      await screen.findByText(
        /price must be greater than 0/i,
      ),
    ).toBeInTheDocument()

    expect(createVehicle).not.toHaveBeenCalled()
  })

  it('shows validation error for invalid quantity', async () => {
    renderAddVehicle()

    fillValidForm()

    const quantityInput =
      screen.getByPlaceholderText('5')

    // Disable native browser validation for this test.
    quantityInput.removeAttribute('min')

    fireEvent.input(quantityInput, {
      target: { value: '-1' },
    })

    expect(quantityInput).toHaveValue(-1)

    const form = screen
      .getByRole('button', {
        name: /add vehicle/i,
      })
      .closest('form')

    fireEvent.submit(form)

    expect(
      await screen.findByText(
        /quantity must be a valid integer greater than or equal to 0/i,
      ),
    ).toBeInTheDocument()

    expect(createVehicle).not.toHaveBeenCalled()
  })

  it('shows validation error when quantity is not an integer', async () => {
    renderAddVehicle()

    fillValidForm()

    const quantityInput =
      screen.getByPlaceholderText('5')

    quantityInput.removeAttribute('min')
    quantityInput.removeAttribute('step')

    fireEvent.input(quantityInput, {
      target: { value: '2.5' },
    })

    expect(quantityInput).toHaveValue(2.5)

    const form = screen
      .getByRole('button', {
        name: /add vehicle/i,
      })
      .closest('form')

    fireEvent.submit(form)

    expect(
      await screen.findByText(
        /quantity must be a valid integer greater than or equal to 0/i,
      ),
    ).toBeInTheDocument()

    expect(createVehicle).not.toHaveBeenCalled()
  })

  it('creates a vehicle successfully', async () => {
    const createdVehicle = {
      id: 101,
      make: 'Toyota',
      model: 'Camry',
      category: 'Sedan',
      price: 25000,
      quantity: 5,
    }

    createVehicle.mockResolvedValue(createdVehicle)

    renderAddVehicle()

    fillValidForm()

    fireEvent.click(
      screen.getByRole('button', {
        name: /add vehicle/i,
      }),
    )

    await waitFor(() => {
      expect(createVehicle).toHaveBeenCalledWith({
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      })
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/vehicles/101',
      )
    })
  })

  it('trims whitespace before creating a vehicle', async () => {
    createVehicle.mockResolvedValue({
      id: 102,
    })

    renderAddVehicle()

    fireEvent.change(
      screen.getByPlaceholderText(/e.g. toyota/i),
      {
        target: { value: '  Toyota  ' },
      },
    )

    fireEvent.change(
      screen.getByPlaceholderText(/e.g. camry/i),
      {
        target: { value: '  Camry  ' },
      },
    )

    fireEvent.change(
      screen.getByRole('combobox'),
      {
        target: { value: 'Sedan' },
      },
    )

    fireEvent.change(
      screen.getByPlaceholderText('25000'),
      {
        target: { value: '25000' },
      },
    )

    fireEvent.change(
      screen.getByPlaceholderText('5'),
      {
        target: { value: '5' },
      },
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: /add vehicle/i,
      }),
    )

    await waitFor(() => {
      expect(createVehicle).toHaveBeenCalledWith({
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      })
    })
  })

  it('shows API error when vehicle creation fails', async () => {
    createVehicle.mockRejectedValue(
      new Error('Failed to create vehicle'),
    )

    renderAddVehicle()

    fillValidForm()

    fireEvent.click(
      screen.getByRole('button', {
        name: /add vehicle/i,
      }),
    )

    expect(
      await screen.findByText(
        /failed to create vehicle/i,
      ),
    ).toBeInTheDocument()

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('shows loading state while creating a vehicle', async () => {
    let resolveRequest

    createVehicle.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve
        }),
    )

    renderAddVehicle()

    fillValidForm()

    const button = screen.getByRole('button', {
      name: /add vehicle/i,
    })

    fireEvent.click(button)

    expect(
      await screen.findByRole('button', {
        name: /adding vehicle/i,
      }),
    ).toBeDisabled()

    resolveRequest({
      id: 103,
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/vehicles/103',
      )
    })
  })

  it('navigates to vehicles when Cancel is clicked', () => {
    renderAddVehicle()

    fireEvent.click(
      screen.getByRole('button', {
        name: /cancel/i,
      }),
    )

    expect(mockNavigate).toHaveBeenCalledWith(
      '/vehicles',
    )
  })

  it('contains a Back to Vehicles link', () => {
    renderAddVehicle()

    const link = screen.getByRole('link', {
      name: /back to vehicles/i,
    })

    expect(link).toHaveAttribute(
      'href',
      '/vehicles',
    )
  })
})