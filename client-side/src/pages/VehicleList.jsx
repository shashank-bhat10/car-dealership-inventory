import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  searchVehicles,
  purchaseVehicle,
} from '../services/vehicleApi'

import { useAuth } from '../context/AuthContext'


function VehicleList() {
  const { user } = useAuth()

  const isAdmin =
    user?.role?.toUpperCase() === 'ADMIN'


  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [purchaseLoading, setPurchaseLoading] =
    useState(null)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [stockOnly, setStockOnly] = useState(false)
  const [page, setPage] = useState(1)


  /* =========================================================
     LOAD VEHICLES
  ========================================================= */

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await searchVehicles({
          q: search,
          category: category === 'All' ? '' : category,
          min_price: minPrice,
          max_price: maxPrice,
          page,
          limit: 100,
          in_stock: stockOnly,
        })

        if (active) {
          setVehicles(data)
        }
      } catch (error) {
        console.error(
          'Load vehicles error:',
          error
        )

        if (active) {
          setError(
            error.message ||
            'Unable to load vehicles.'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    let active = true
    loadVehicles()
    return () => {
      active = false
    }
  }, [search, category, minPrice, maxPrice, page, stockOnly])


  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories = [
    'All',
    'Sedan',
    'SUV',
    'Truck',
    'Hatchback',
    'Electric',
    'Coupe',
  ]


  /* =========================================================
     FILTER VEHICLES
  ========================================================= */

  const filteredVehicles = useMemo(() => {
    const minimum =
      minPrice === ''
        ? null
        : Number(minPrice)

    const maximum =
      maxPrice === ''
        ? null
        : Number(maxPrice)

    const priceRangeIsValid =
      (minimum === null || Number.isFinite(minimum)) &&
      (maximum === null || Number.isFinite(maximum))

    if (!priceRangeIsValid) {
      return []
    }

    return stockOnly
      ? vehicles.filter((vehicle) => Number(vehicle.quantity) > 0)
      : vehicles
  }, [vehicles, stockOnly, minPrice, maxPrice])


  /* =========================================================
     RESET FILTERS
  ========================================================= */

  const resetFilters = () => {
    setSearch('')
    setCategory('All')
    setMinPrice('')
    setMaxPrice('')
    setStockOnly(false)
    setPage(1)
  }


  /* =========================================================
     PURCHASE VEHICLE
  ========================================================= */

  const handlePurchase = async (vehicle) => {
    const quantity =
      Number(vehicle.quantity) || 0

    if (quantity <= 0) {
      return
    }

    try {
      setError('')
      setPurchaseLoading(vehicle.id)

      const data = await purchaseVehicle(
        vehicle.id,
        1
      )

      setVehicles((previousVehicles) =>
        previousVehicles.map((item) =>
          item.id === vehicle.id
            ? data.vehicle
            : item
        )
      )

    } catch (error) {
      console.error(
        'Purchase vehicle error:',
        error
      )

      setError(
        error.message ||
        'Unable to purchase vehicle.'
      )
    } finally {
      setPurchaseLoading(null)
    }
  }


  /* =========================================================
     LOADING
  ========================================================= */

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <div className="app-shell">

      <main className="catalog">


        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="catalog-header">

          <div>

            <div className="eyebrow">
              AutoVault · Vehicle Catalog
            </div>

            <h1 className="catalog-title">
              Vehicle inventory
            </h1>

            <p className="catalog-description">
              Browse vehicles, compare prices, and keep stock up to date.
            </p>

          </div>


          {/* ADMIN ONLY */}

          {isAdmin && (
            <Link
              to="/vehicles/add"
              className="add-vehicle-btn"
            >
              <span>+</span>
              Add Vehicle
            </Link>
          )}

        </div>


        {/* =====================================================
            FILTER PANEL
        ====================================================== */}

        <section className="filter-panel">


          {/* =================================================
              SEARCH
          ================================================== */}

          <div className="search-box">

            <span className="search-icon">
              ⌕
            </span>

            <input
              aria-label="Search by make or model"
              className="search-input"
              type="text"
              placeholder="Search by make or model..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
            />

          </div>


          {/* =================================================
              CATEGORY FILTERS
          ================================================== */}

          <div className="filter-row">

            {categories.map((item) => (

              <button
                key={item}
                aria-pressed={category === item}
                type="button"
                className={`filter-pill ${
                  category === item
                    ? 'active'
                    : ''
                }`}
                onClick={() => {
                  setCategory(item)
                  setPage(1)
                }}
              >
                {item}
              </button>

            ))}

          </div>


          {/* =================================================
              PRICE FILTERS
          ================================================== */}

          <div
            className="filter-row"
            style={{
              marginTop: '12px',
              alignItems: 'center',
            }}
          >

            <input
              className="search-input"
              style={{
                maxWidth: '180px',
                border: '1px solid #334155',
                borderRadius: '10px',
                padding: '10px 12px',
              }}
              type="number"
              min="0"
              placeholder="Min price ₹"
              aria-label="Minimum price in rupees"
              value={minPrice}
              onChange={(event) => {
                setMinPrice(event.target.value)
                setPage(1)
              }}
            />

            <input
              className="search-input"
              style={{
                maxWidth: '180px',
                border: '1px solid #334155',
                borderRadius: '10px',
                padding: '10px 12px',
              }}
              type="number"
              min="0"
              placeholder="Max price ₹"
              aria-label="Maximum price in rupees"
              value={maxPrice}
              onChange={(event) => {
                setMaxPrice(event.target.value)
                setPage(1)
              }}
            />


            {/* STOCK FILTER */}

            <button
              type="button"
              aria-pressed={stockOnly}
              className={`filter-pill ${
                stockOnly
                  ? 'active'
                  : ''
              }`}
              onClick={() => {
                setStockOnly(!stockOnly)
                setPage(1)
              }}
            >
              ✓ In Stock Only
            </button>


            {/* RESET */}

            {(search ||
              category !== 'All' ||
              minPrice !== '' ||
              maxPrice !== '' ||
              stockOnly) && (

              <button
                type="button"
                className="filter-pill"
                onClick={resetFilters}
              >
                Reset
              </button>

            )}

          </div>

        </section>


        {/* =====================================================
            INVENTORY COUNT
        ====================================================== */}

        <div className="inventory-info">

          <div className="inventory-count">

            Showing{' '}

            <strong
              style={{
                color: 'white',
              }}
            >
              {filteredVehicles.length}
            </strong>{' '}

            of {vehicles.length} vehicles on this page

          </div>

        </div>

        <nav aria-label="Inventory pages" className="mb-6 flex flex-wrap items-center gap-3">
          <button className="view-btn px-4 py-2" disabled={loading || page === 1}
            onClick={() => setPage(page - 1)}>Previous page</button>
          <span role="status" className="text-sm text-slate-400">{loading ? 'Loading vehicle inventory...' : `Page ${page}`}</span>
          <button className="view-btn px-4 py-2" disabled={loading || vehicles.length < 100}
            onClick={() => setPage(page + 1)}>Next page</button>
        </nav>


        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (

          <div className="error-box" role="alert">
            {error}
          </div>

        )}


        {/* =====================================================
            EMPTY RESULT
        ====================================================== */}

        {!error && filteredVehicles.length === 0 && (

            <div className="error-box">
              No vehicles match your filters.
            </div>

          )}


        {/* =====================================================
            VEHICLE GRID
        ====================================================== */}

        {filteredVehicles.length > 0 && (

            <div className="vehicle-grid">

              {filteredVehicles.map(
                (vehicle) => {

                  const quantity =
                    Number(vehicle.quantity) || 0

                  const inStock =
                    quantity > 0

                  const isPurchasing =
                    purchaseLoading === vehicle.id


                  return (

                    <article
                      className="vehicle-card"
                      key={vehicle.id}
                    >


                      {/* IMAGE */}

                      <div className="vehicle-image">

                        <div className="vehicle-emoji">
                          🚗
                        </div>

                        <span className="category-badge">
                          {vehicle.category}
                        </span>

                        <span
                          className={`stock-badge ${
                            inStock
                              ? 'in-stock'
                              : 'out-stock'
                          }`}
                        >
                          {inStock
                            ? `In Stock: ${quantity}`
                            : 'Out of Stock'}
                        </span>

                      </div>


                      {/* CONTENT */}

                      <div className="vehicle-content">

                        <p className="vehicle-make">
                          {vehicle.make}
                        </p>

                        <h2 className="vehicle-model">
                          {vehicle.model}
                        </h2>

                        <div className="vehicle-price">
                          ₹
                          {Number(
                            vehicle.price
                          ).toLocaleString(
                            'en-IN'
                          )}
                        </div>

                        <div className="vehicle-meta">

                          <span>
                            ◉ {vehicle.category}
                          </span>

                          <span>
                            Stock: {quantity}
                          </span>

                        </div>


                        {/* ACTIONS */}

                        <div className="vehicle-actions">

                          <Link
                            className="view-btn"
                            to={`/vehicles/${vehicle.id}`}
                          >
                            View Details
                          </Link>

                          <button
                            type="button"
                            className="purchase-btn"
                            disabled={
                              !inStock ||
                              isPurchasing || loading
                            }
                            onClick={() =>
                              handlePurchase(vehicle)
                            }
                          >
                            {isPurchasing
                              ? 'Purchasing...'
                              : inStock
                                ? 'Purchase'
                                : 'Sold Out'}
                          </button>

                        </div>

                      </div>

                    </article>

                  )
                }
              )}

            </div>

          )}

      </main>

    </div>
  )
}


export default VehicleList
