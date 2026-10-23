import { useState } from 'react'

// The parent owns the saved vehicle; this form owns only the pending edits.
export default function EditVehicleForm({ vehicle, onSave, onCancel }) {
  const [editDraft, setEditDraft] = useState(() => ({
    make: vehicle.make, model: vehicle.model, category: vehicle.category,
    price: String(vehicle.price), quantity: String(vehicle.quantity),
  }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (saving) return
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
      await onSave(payload)
    } catch (error) {
      setError(error.message || 'Unable to update vehicle.')
    } finally {
      setSaving(false)
    }
  }

  return (
              <form aria-label="Edit vehicle" onSubmit={handleSubmit} className="mt-6 rounded-xl border border-slate-700 p-5">
                <h3 className="mb-4 text-xl font-bold text-white">Edit vehicle</h3>
                {error && <p role="alert" className="mb-4 text-rose-300">{error}</p>}
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
                      onClick={onCancel}>Cancel editing</button>
                  </div>
                </fieldset>
              </form>
  )
}
