import { beforeEach, describe, expect, it, vi } from 'vitest'
import { request } from '../api'
import { searchVehicles } from '../vehicleApi'

vi.mock('../api', () => ({ request: vi.fn().mockResolvedValue([]) }))

describe('vehicle search request', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sends the stock filter together with pagination and search criteria', async () => {
    await searchVehicles({ q: ' Toyota ', in_stock: true, page: 2, limit: 100 })
    const url = new URL(request.mock.calls[0][0], 'http://localhost')
    expect(url.searchParams.get('in_stock')).toBe('true')
    expect(url.searchParams.get('q')).toBe('Toyota')
    expect(url.searchParams.get('page')).toBe('2')
  })
})
