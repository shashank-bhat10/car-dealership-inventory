import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Car,
  Plus,
  Package,
  Tag,
  DollarSign,
  Hash,
  AlertCircle,
} from 'lucide-react'

import { createVehicle } from '../services/vehicleApi'

function AddVehicle() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    category: '',
    price: '',
    quantity: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    const make = formData.make.trim()
    const model = formData.model.trim()
    const category = formData.category.trim()
    const price = Number(formData.price)
    const quantity = Number(formData.quantity)

    if (!make || !model || !category) {
      setError('Please fill in all required fields.')
      return
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError('Price must be greater than 0.')
      return
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      setError(
        'Quantity must be a valid integer greater than or equal to 0.',
      )
      return
    }

    setLoading(true)

    try {
      const vehicle = await createVehicle({
        make,
        model,
        category,
        price,
        quantity,
      })

      navigate(`/vehicles/${vehicle.id}`)
    } catch (error) {
      console.error('Add vehicle error:', error)

      setError(
        error.message || 'Failed to add vehicle.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Back */}
        <Link
          to="/vehicles"
          className="inline-flex items-center gap-2 mb-8 text-sm font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vehicles
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Plus className="w-3.5 h-3.5" />
            Inventory Management
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Add Vehicle
          </h1>

          <p className="mt-3 text-slate-400">
            Add a new vehicle to the AutoVault inventory.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/30 overflow-hidden">

          {/* Card Header */}
          <div className="px-8 py-6 border-b border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center">
              <Car className="w-6 h-6 text-indigo-400" />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Vehicle Information
              </h2>

              <p className="text-sm text-slate-500">
                Enter the details of the vehicle.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-8"
          >

            {/* Error */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-rose-300">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />

                <p className="text-sm font-medium">
                  {error}
                </p>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Make */}
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-300">
                  <Car className="w-4 h-4 text-indigo-400" />
                  Make
                </label>

                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  placeholder="e.g. Toyota"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>

              {/* Model */}
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-300">
                  <Tag className="w-4 h-4 text-indigo-400" />
                  Model
                </label>

                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. Camry"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-300">
                  <Package className="w-4 h-4 text-indigo-400" />
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                >
                  <option value="">
                    Select category
                  </option>

                  <option value="Sedan">
                    Sedan
                  </option>

                  <option value="SUV">
                    SUV
                  </option>

                  <option value="Truck">
                    Truck
                  </option>

                  <option value="Hatchback">
                    Hatchback
                  </option>

                  <option value="Electric">
                    Electric
                  </option>

                  <option value="Coupe">
                    Coupe
                  </option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-300">
                  <DollarSign className="w-4 h-4 text-indigo-400" />
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="25000"
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>

              {/* Quantity */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-300">
                  <Hash className="w-4 h-4 text-indigo-400" />
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="5"
                  min="0"
                  step="1"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>

            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-slate-800">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-bold transition shadow-lg shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" />

                {loading
                  ? 'Adding Vehicle...'
                  : 'Add Vehicle'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/vehicles')}
                className="sm:w-32 h-12 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold transition"
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default AddVehicle