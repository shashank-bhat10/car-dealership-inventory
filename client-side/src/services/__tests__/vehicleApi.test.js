import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
  searchVehicles,
} from '../vehicleApi'

import { request } from '../api'

vi.mock('../api', () => ({
  request: vi.fn(),
}))

describe('vehicleApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getVehicles calls the vehicles endpoint', async () => {
    const vehicles = [
      {
        id: 1,
        make: 'Toyota',
        model: 'Camry',
      },
    ]

    request.mockResolvedValue(vehicles)

    const result = await getVehicles()

    expect(request).toHaveBeenCalledWith(
      '/api/vehicles',
    )

    expect(result).toEqual(vehicles)
  })

  it('getVehicle calls the correct vehicle endpoint', async () => {
    const vehicle = {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
    }

    request.mockResolvedValue(vehicle)

    const result = await getVehicle(1)

    expect(request).toHaveBeenCalledWith(
      '/api/vehicles/1',
    )

    expect(result).toEqual(vehicle)
  })

  it('getVehicle converts vehicle id to a number', async () => {
    request.mockResolvedValue({ id: 10 })

    await getVehicle('10')

    expect(request).toHaveBeenCalledWith(
      '/api/vehicles/10',
    )
  })

  it('createVehicle sends POST request with vehicle data', async () => {
    const vehicleData = {
      make: 'Toyota',
      model: 'Camry',
      category: 'Sedan',
      price: 25000,
      quantity: 5,
    }

    const createdVehicle = {
      id: 10,
      ...vehicleData,
    }

    request.mockResolvedValue(createdVehicle)

    const result = await createVehicle(vehicleData)

    expect(request).toHaveBeenCalledWith(
      '/api/vehicles',
      {
        method: 'POST',
        body: JSON.stringify(vehicleData),
      },
    )

    expect(result).toEqual(createdVehicle)
  })

  it('updateVehicle sends PUT request with vehicle data', async () => {
    const vehicleData = {
      make: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      price: 22000,
      quantity: 3,
    }

    const updatedVehicle = {
      id: 5,
      ...vehicleData,
    }

    request.mockResolvedValue(updatedVehicle)

    const result = await updateVehicle(
      5,
      vehicleData,
    )

    expect(request).toHaveBeenCalledWith(
      '/api/vehicles/5',
      {
        method: 'PUT',
        body: JSON.stringify(vehicleData),
      },
    )

    expect(result).toEqual(updatedVehicle)
  })

  it('updateVehicle converts vehicle id to a number', async () => {
    request.mockResolvedValue({ id: 7 })

    await updateVehicle('7', {
      price: 30000,
    })

    expect(request).toHaveBeenCalledWith(
      '/api/vehicles/7',
      {
        method: 'PUT',
        body: JSON.stringify({
          price: 30000,
        }),
      },
    )
  })

  it('deleteVehicle sends DELETE request', async () => {
    request.mockResolvedValue({
      message: 'Vehicle deleted successfully',
    })

    const result = await deleteVehicle(8)

    expect(request).toHaveBeenCalledWith(
      '/api/vehicles/8',
      {
        method: 'DELETE',
      },
    )

    expect(result).toEqual({
      message: 'Vehicle deleted successfully',
    })
  })

  it('purchaseVehicle sends POST request with quantity', async () => {
    const response = {
      message: 'Vehicle purchased successfully',
      quantity: 4,
    }

    request.mockResolvedValue(response)

    const result = await purchaseVehicle(12, 2)

    expect(request).toHaveBeenCalledWith(
      '/api/vehicles/12/purchase',
      {
        method: 'POST',
        body: JSON.stringify({
          quantity: 2,
        }),
      },
    )

    expect(result).toEqual(response)
  })

  it('restockVehicle sends POST request with quantity', async () => {
    const response = {
      message: 'Vehicle restocked successfully',
      quantity: 7,
    }

    request.mockResolvedValue(response)

    const result = await restockVehicle(15, 5)

    expect(request).toHaveBeenCalledWith(
      '/api/vehicles/15/restock',
      {
        method: 'POST',
        body: JSON.stringify({
          quantity: 5,
        }),
      },
    )

    expect(result).toEqual(response)
  })

  it('searchVehicles sends all provided search parameters', async () => {
    const response = [
      {
        id: 1,
        make: 'Toyota',
        model: 'Camry',
      },
    ]

    request.mockResolvedValue(response)

    const result = await searchVehicles({
      make: 'Toyota',
      model: 'Camry',
      category: 'Sedan',
      min_price: 20000,
      max_price: 30000,
    })

    expect(request).toHaveBeenCalledWith(
      '/api/vehicles/search?make=Toyota&model=Camry&category=Sedan&min_price=20000&max_price=30000',
    )

    expect(result).toEqual(response)
  })

  it('searchVehicles sends only provided parameters', async () => {
    request.mockResolvedValue([])

    await searchVehicles({
      make: 'Tesla',
    })

    expect(request).toHaveBeenCalledWith(
      '/api/vehicles/search?make=Tesla',
    )
  })

  it('searchVehicles handles an empty parameter object', async () => {
    request.mockResolvedValue([])

    await searchVehicles({})

    expect(request).toHaveBeenCalledWith(
      '/api/vehicles/search?',
    )
  })

  it('propagates request errors from getVehicles', async () => {
    const error = new Error('Network error')

    request.mockRejectedValue(error)

    await expect(getVehicles()).rejects.toThrow(
      'Network error',
    )
  })

  it('propagates request errors from createVehicle', async () => {
    const error = new Error('Unauthorized')

    request.mockRejectedValue(error)

    await expect(
      createVehicle({
        make: 'Toyota',
        model: 'Camry',
      }),
    ).rejects.toThrow('Unauthorized')
  })
})