import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getVehicles } from '../services/vehicleApi'

function VehicleList() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await getVehicles()

        setVehicles(data)
      } catch (error) {
        setError(error.message)
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
    return <p>{error}</p>
  }

  return (
    <div>
      <h1>Vehicles</h1>

      <Link to="/vehicles/add">
        Add Vehicle
      </Link>

      {vehicles.length === 0 ? (
        <p>No vehicles found.</p>
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

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VehicleList