import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getVehicles } from '../services/vehicleApi'

function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getVehicles()

        setVehicles(data)
      } catch (error) {
        setError(
          error.message ||
            'Failed to load vehicles.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadVehicles()
  }, [])

  if (loading) {
    return <p>Loading vehicles...</p>
  }

  if (error) {
    return (
      <div>
        <h2>Vehicles</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Vehicles</h1>

      <Link to="/vehicles/add">
        Add Vehicle
      </Link>

      {vehicles.length === 0 ? (
        <p>No vehicles available.</p>
      ) : (
        <div>
          {vehicles.map((vehicle) => (
            <div key={vehicle.id}>
              <h2>
                {vehicle.make} {vehicle.model}
              </h2>

              <p>
                Category: {vehicle.category}
              </p>

              <p>
                Price: ₹{vehicle.price}
              </p>

              <p>
                Quantity: {vehicle.quantity}
              </p>

              <Link
                to={`/vehicles/${vehicle.id}`}
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Vehicles