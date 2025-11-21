import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCircle, ShoppingCart, FileText, Package, DollarSign, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function DashboardCards({ stats }) {
  const cards = [
    {
      title: 'Active Vendors',
      value: stats.activeVendors,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Customers',
      value: stats.activeCustomers,
      icon: UserCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Pending POs',
      value: stats.pendingPOs,
      icon: ShoppingCart,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Unpaid Invoices',
      value: stats.unpaidInvoices,
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Active Orders',
      value: stats.activeOrders,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Spending',
      value: formatCurrency(stats.totalSpending),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
