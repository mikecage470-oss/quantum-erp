import DashboardCards from '@/components/dashboard/DashboardCards'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useVendorStore from '@/stores/vendorStore'
import useCustomerStore from '@/stores/customerStore'
import usePOStore from '@/stores/poStore'
import useInvoiceStore from '@/stores/invoiceStore'
import useOrderTrackingStore from '@/stores/orderTrackingStore'

export default function Dashboard() {
  const vendors = useVendorStore((state) => state.vendors)
  const customers = useCustomerStore((state) => state.customers)
  const purchaseOrders = usePOStore((state) => state.purchaseOrders)
  const invoices = useInvoiceStore((state) => state.invoices)
  const orders = useOrderTrackingStore((state) => state.orders)

  const activeVendors = vendors.filter(v => v.status === 'Active').length
  const activeCustomers = customers.filter(c => c.status === 'Active').length
  const pendingPOs = purchaseOrders.filter(po => po.status === 'Pending' || po.status === 'Draft').length
  const unpaidInvoices = invoices.filter(inv => inv.status !== 'Paid').length
  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length

  const totalRevenue = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.total, 0)

  const totalSpending = purchaseOrders
    .filter(po => po.status === 'Approved' || po.status === 'Completed')
    .reduce((sum, po) => sum + po.total, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome to Quantum ERP - Your complete business management solution
        </p>
      </div>

      <DashboardCards
        stats={{
          activeVendors,
          activeCustomers,
          pendingPOs,
          unpaidInvoices,
          activeOrders,
          totalRevenue,
          totalSpending
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {purchaseOrders.slice(0, 5).map((po) => (
                <div key={po.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{po.id}</p>
                    <p className="text-sm text-gray-500">{po.vendorName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${po.total.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      po.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      po.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {po.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.slice(0, 5).map((inv) => (
                <div key={inv.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{inv.id}</p>
                    <p className="text-sm text-gray-500">{inv.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${inv.total.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      inv.status === 'Paid' ? 'bg-green-100 text-green-800' :
                      inv.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                      inv.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
