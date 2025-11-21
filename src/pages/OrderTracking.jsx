import OrderTrackingTable from '@/components/order-tracking/OrderTrackingTable'

export default function OrderTracking() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track and monitor all orders with advanced filtering and export capabilities
        </p>
      </div>

      <OrderTrackingTable />
    </div>
  )
}
