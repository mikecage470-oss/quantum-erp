import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function OrderTrackingDetail({ order, isOpen, onClose }) {
  if (!order) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Order Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Order Number:</span>
                <span className="text-sm font-medium">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Order ID:</span>
                <span className="text-sm font-medium">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge>{order.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Priority:</span>
                <span className="text-sm font-medium">{order.priority}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Customer & Product
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Customer:</span>
                <span className="text-sm font-medium">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Product:</span>
                <span className="text-sm font-medium">{order.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Quantity:</span>
                <span className="text-sm font-medium">{order.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Cost:</span>
                <span className="text-sm font-medium">{formatCurrency(order.cost)}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Dates
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Order Date:</span>
                <span className="text-sm font-medium">{formatDate(order.orderDate)}</span>
              </div>
              {order.shipDate && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ship Date:</span>
                  <span className="text-sm font-medium">{formatDate(order.shipDate)}</span>
                </div>
              )}
              {order.deliveryDate && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Delivery Date:</span>
                  <span className="text-sm font-medium">{formatDate(order.deliveryDate)}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Shipping Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Carrier:</span>
                <span className="text-sm font-medium">{order.carrier}</span>
              </div>
              {order.trackingNumber && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tracking #:</span>
                  <span className="text-sm font-medium font-mono">{order.trackingNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Origin:</span>
                <span className="text-sm font-medium">{order.origin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Destination:</span>
                <span className="text-sm font-medium">{order.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Weight:</span>
                <span className="text-sm font-medium">{order.weight} lbs</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
