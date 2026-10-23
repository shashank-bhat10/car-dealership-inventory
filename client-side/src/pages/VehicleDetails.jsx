import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  getVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
  updateVehicle,
} from '../services/vehicleApi'

import { useAuth } from '../context/AuthContext'


function VehicleDetails() {
  const { vehicleId } = useParams()
  const navigate = useNavigate()

  const { user } = useAuth()

  const isAdmin =
    user?.role?.toUpperCase() === 'ADMIN'


  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editDraft, setEditDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  const [purchaseLoading, setPurchaseLoading] =
    useState(false)

  const [restockLoading, setRestockLoading] =
    useState(false)

  const [deleteLoading, setDeleteLoading] =
    useState(false)


  /* =========================================================
     LOAD VEHICLE
  ========================================================= */

  const loadVehicle = async () => {
    try {
      setLoading(true)
      setError('')

      const id = Number(vehicleId)

      if (!Number.isInteger(id)) {
        throw new Error('Invalid vehicle ID')
      }

      const data = await getVehicle(id)

      setVehicle(data)
    } catch (error) {
      console.error(
        'Load vehicle error:',
        error
      )

      setError(
        error.message ||
        'Unable to load vehicle.'
      )
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    loadVehicle()
  }, [vehicleId])


  const startEditing = () => {
    if (!isAdmin) return
    setError('')
    setSuccess('')
    setEditDraft({
      make: vehicle.make, model: vehicle.model, category: vehicle.category,
      price: String(vehicle.price), quantity: String(vehicle.quantity),
    })
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    if (!isAdmin || saving || !editDraft) return
    setError('')
    const payload = {
      make: editDraft.make.trim(), model: editDraft.model.trim(),
      category: editDraft.category.trim(), price: Number(editDraft.price),
      quantity: Number(editDraft.quantity),
    }
    if (!payload.make || !payload.model || !payload.category ||
        [payload.make, payload.model, payload.category].some(value => value.length > 50)) {
      setError('Make, model and category must contain 1 to 50 characters.')
      return
    }
    if (editDraft.price === '' || !Number.isFinite(payload.price) || payload.price <= 0) {
      setError('Price must be greater than 0.')
      return
    }
    if (editDraft.quantity === '' || !Number.isInteger(payload.quantity) || payload.quantity < 0) {
      setError('Quantity must be a whole number greater than or equal to 0.')
      return
    }
    setSaving(true)
    try {
      const updated = await updateVehicle(Number(vehicleId), payload)
      setVehicle(updated)
      setEditDraft(null)
      setSuccess('Vehicle updated.')
    } catch (error) {
      setError(error.message || 'Unable to update vehicle.')
    } finally {
      setSaving(false)
    }
  }

  /* =========================================================
     PURCHASE
  ========================================================= */

  const handlePurchase = async () => {
    if (!vehicle) {
      return
    }

    if (Number(vehicle.quantity) <= 0) {
      setError('Vehicle is out of stock.')
      return
    }

    try {
      setError('')
      setPurchaseLoading(true)

      const data = await purchaseVehicle(
        Number(vehicleId),
        1
      )

      setVehicle(data.vehicle)
    } catch (error) {
      console.error(
        'Purchase error:',
        error
      )

      setError(
        error.message ||
        'Unable to purchase vehicle.'
      )
    } finally {
      setPurchaseLoading(false)
    }
  }


  /* =========================================================
     RESTOCK
  ========================================================= */

  const handleRestock = async () => {
    try {
      setError('')
      setRestockLoading(true)

      const data = await restockVehicle(
        Number(vehicleId),
        1
      )

      setVehicle(data.vehicle)
    } catch (error) {
      console.error(
        'Restock error:',
        error
      )

      setError(
        error.message ||
        'Unable to restock vehicle.'
      )
    } finally {
      setRestockLoading(false)
    }
  }


  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async () => {

    /*
     * Frontend check gives the USER an immediate
     * and clear message.
     *
     * Backend still performs the real authorization.
     */
    if (!isAdmin) {
      setError('Admin access required')
      return
    }


    const confirmed = window.confirm(
      `Are you sure you want to delete ${vehicle.make} ${vehicle.model}?`
    )

    if (!confirmed) {
      return
    }


    try {
      setError('')
      setDeleteLoading(true)

      await deleteVehicle(
        Number(vehicleId)
      )

      navigate('/vehicles')

    } catch (error) {
      console.error(
        'Delete error:',
        error
      )

      setError(
        error.message ||
        'Unable to delete vehicle.'
      )
    } finally {
      setDeleteLoading(false)
    }
  }


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="app-shell">

        <div className="loading-container">

          <div>

            <div className="spinner"></div>

            <p
              style={{
                marginTop: '15px',
                color: '#64748b',
                fontSize: '13px',
                textAlign: 'center',
              }}
            >
              Loading vehicle...
            </p>

          </div>

        </div>

      </div>
    )
  }


  /* =========================================================
     ERROR WITHOUT VEHICLE
  ========================================================= */

  if (error && !vehicle) {
    return (
      <div className="app-shell">

        <main className="catalog">

          <div role="alert"
            className="error-box">
            {error}
          </div>

          <br />

          <Link
            to="/vehicles"
            className="view-btn"
            style={{
              display: 'inline-flex',
              padding: '12px 18px',
            }}
          >
            Back to Vehicles
          </Link>

        </main>

      </div>
    )
  }


  if (!vehicle) {
    return (
      <div className="app-shell">

        <main className="catalog">

          <div role="alert"
            className="error-box">
            Vehicle not found.
          </div>

        </main>

      </div>
    )
  }


  /* =========================================================
     VEHICLE VALUES
  ========================================================= */

  const quantity =
    Number(vehicle.quantity) || 0

  const inStock =
    quantity > 0


  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <div className="app-shell">

      <main className="catalog">

        {/* ================================================
            HEADER
        ================================================= */}

        <div className="catalog-header">

          <div>

            <div className="eyebrow">
              AutoVault · Vehicle Details
            </div>

            <h1 className="catalog-title">
              {vehicle.make}
              <br />
              {vehicle.model}
            </h1>

            <p className="catalog-description">
              View vehicle information and
              manage inventory.
            </p>

          </div>

        </div>


        {/* ================================================
            ERROR
        ================================================= */}

        {error && (

          <div
            role="alert"
            className="error-box"
            style={{
              marginBottom: '25px',
            }}
          >
            {error}
          </div>

        )}


        {success && <p role="status" className="mb-6 text-emerald-400">{success}</p>}

        {/* ================================================
            VEHICLE DETAILS CARD
        ================================================= */}

        <section
          className="vehicle-card"
          style={{
            maxWidth: '850px',
            margin: '0 auto',
          }}
        >

          {/* IMAGE */}

          <div
            className="vehicle-image"
            style={{
              height: '300px',
            }}
          >

            <div
              className="vehicle-emoji"
              style={{
                fontSize: '140px',
              }}
            >
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


            {/* PRICE */}

            <div className="vehicle-price">
              ₹
              {Number(
                vehicle.price
              ).toLocaleString('en-IN')}
            </div>


            {/* INFORMATION */}

            <div
              className="vehicle-meta"
              style={{
                fontSize: '13px',
              }}
            >

              <span>
                Category: {vehicle.category}
              </span>

              <span>
                Stock: {quantity}
              </span>

            </div>


            {/* ============================================
                ACTIONS
            ============================================= */}

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                marginTop: '25px',
              }}
            >

              {/* PURCHASE */}

              <button
                type="button"
                className="purchase-btn"
                disabled={
                  !inStock || editDraft !== null ||
                  purchaseLoading
                }
                onClick={handlePurchase}
                style={{
                  flex: '1',
                  minWidth: '140px',
                }}
              >
                {purchaseLoading
                  ? 'Purchasing...'
                  : inStock
                    ? 'Purchase 1'
                    : 'Sold Out'}
              </button>


              {isAdmin && !editDraft && (
                <button type="button" className="view-btn" onClick={startEditing}
                  disabled={purchaseLoading || restockLoading || deleteLoading}>Edit vehicle</button>
              )}

              {/* RESTOCK */}

              <button
                type="button"
                className="view-btn"
                disabled={restockLoading || editDraft !== null}
                onClick={handleRestock}
                style={{
                  flex: '1',
                  minWidth: '140px',
                  cursor: restockLoading
                    ? 'not-allowed'
                    : 'pointer',
                  opacity: restockLoading
                    ? 0.6
                    : 1,
                }}
              >
                {restockLoading
                  ? 'Restocking...'
                  : 'Restock 1'}
              </button>


              {/* DELETE */}

              <button
                type="button"
                className="view-btn"
                disabled={deleteLoading || editDraft !== null}
                onClick={handleDelete}
                style={{
                  flex: '1',
                  minWidth: '140px',
                  color: '#fb7185',
                  borderColor:
                    'rgba(244, 63, 94, 0.35)',
                  cursor: deleteLoading
                    ? 'not-allowed'
                    : 'pointer',
                  opacity: deleteLoading
                    ? 0.6
                    : 1,
                }}
              >
                {deleteLoading
                  ? 'Deleting...'
                  : 'Delete Vehicle'}
              </button>

            </div>


            {isAdmin && editDraft && (
              <form aria-label="Edit vehicle" onSubmit={handleUpdate} className="mt-6 rounded-xl border border-slate-700 p-5">
                <h3 className="mb-4 text-xl font-bold text-white">Edit vehicle</h3>
                <fieldset disabled={saving} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {['make', 'model', 'category', 'price', 'quantity'].map(field => (
                    <div key={field}>
                      <label htmlFor={`edit-${field}`} className="mb-2 block text-sm text-slate-300">
                        {field[0].toUpperCase() + field.slice(1)}
                      </label>
                      <input id={`edit-${field}`} name={field} required
                        type={['price', 'quantity'].includes(field) ? 'number' : 'text'}
                        min={field === 'price' ? '0.01' : field === 'quantity' ? '0' : undefined}
                        step={field === 'price' ? '0.01' : field === 'quantity' ? '1' : undefined}
                        maxLength={['make', 'model', 'category'].includes(field) ? 50 : undefined}
                        value={editDraft[field]}
                        onChange={event => setEditDraft({ ...editDraft, [field]: event.target.value })}
                        className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-white focus:outline-2 focus:outline-indigo-400" />
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-3 sm:col-span-2">
                    <button type="submit" disabled={saving} className="purchase-btn px-4 py-2">{saving ? 'Saving...' : 'Save changes'}</button>
                    <button type="button" disabled={saving} className="view-btn px-4 py-2"
                      onClick={() => { setEditDraft(null); setError('') }}>Cancel editing</button>
                  </div>
                </fieldset>
              </form>
            )}

            {/* ADMIN INFORMATION */}

            {isAdmin && (
              <p
                style={{
                  marginTop: '20px',
                  color: '#34d399',
                  fontSize: '12px',
                  fontWeight: '700',
                }}
              >
                ADMIN · Inventory management enabled
              </p>
            )}

            {!isAdmin && (
              <p
                style={{
                  marginTop: '20px',
                  color: '#64748b',
                  fontSize: '12px',
                }}
              >
                Customer account · Purchase available
              </p>
            )}

          </div>

        </section>


        {/* ================================================
            BACK
        ================================================= */}

        <div
          style={{
            marginTop: '30px',
          }}
        >

          <Link
            to="/vehicles"
            className="view-btn"
            style={{
              display: 'inline-flex',
              padding: '12px 18px',
            }}
          >
            ← Back to Vehicles
          </Link>

        </div>

      </main>

    </div>
  )
}


export default VehicleDetails
