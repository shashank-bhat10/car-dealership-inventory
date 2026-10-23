import {
  CarFront,
  Package,
  Eye,
  ShoppingCart,
} from 'lucide-react'
import { Link } from 'react-router-dom'

function VehicleCard({ vehicle, onPurchase, purchasing }) {
  const isOutOfStock = vehicle.quantity <= 0

  return (
    <article className="vehicle-card">

      <div className="vehicle-card-image">

        <div className="vehicle-card-image-placeholder">
          <CarFront size={52} />
        </div>

        <div className="vehicle-card-badges">

          <span className="vehicle-category-badge">
            {vehicle.category}
          </span>

          <span
            className={
              isOutOfStock
                ? 'vehicle-stock-badge out'
                : 'vehicle-stock-badge'
            }
          >
            {isOutOfStock
              ? 'Out of Stock'
              : `In Stock: ${vehicle.quantity}`}
          </span>

        </div>

      </div>


      <div className="vehicle-card-body">

        <div className="vehicle-card-title">
          <div>
            <h3>
              {vehicle.make}
            </h3>

            <p>
              {vehicle.model}
            </p>
          </div>

          <CarFront size={20} />
        </div>


        <div className="vehicle-card-category">
          {vehicle.category}
        </div>


        <div className="vehicle-card-info">

          <div>
            <Package size={15} />
            <span>
              {vehicle.quantity} units
            </span>
          </div>

        </div>


        <div className="vehicle-card-price">
          ₹{Number(vehicle.price).toLocaleString('en-IN')}
        </div>


        <div className="vehicle-card-actions">

          <Link
            to={`/vehicles/${vehicle.id}`}
            className="vehicle-view-button"
          >
            <Eye size={16} />
            View
          </Link>


          <button
            className={
              isOutOfStock
                ? 'vehicle-purchase-button disabled'
                : 'vehicle-purchase-button'
            }
            disabled={isOutOfStock || purchasing}
            onClick={() => onPurchase(vehicle.id)}
          >

            {purchasing ? (
              <>
                <span className="vehicle-spinner" />
                Processing...
              </>
            ) : isOutOfStock ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart size={16} />
                Purchase
              </>
            )}

          </button>

        </div>

      </div>

    </article>
  )
}

export default VehicleCard