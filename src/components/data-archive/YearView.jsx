import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { MONTH_NAMES } from '@/config/constants'
import useDataArchiveStore from '@/stores/dataArchiveStore'
import { Calendar, ChevronRight, DollarSign, TrendingUp, List } from 'lucide-react'

export default function YearView({ onSelectMonth, onViewAllOrders }) {
  const { archivedOrders, getAllYears, getYearSummary, getMonthsForYear } = useDataArchiveStore()
  const years = useMemo(() => getAllYears(), [archivedOrders])

  if (years.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Archived Data</h3>
          <p className="text-gray-600">
            There are no archived orders yet. To archive orders, go to Order Tracking,
            edit an order, set an Archive Date, and click &quot;Proceed to Data Archive&quot;.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {years.map(year => {
        const summary = getYearSummary(year)
        const months = getMonthsForYear(year)
        
        return (
          <Card key={year} className="overflow-hidden">
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                {year}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Customer PO Amount</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(summary.totalCustomerPOAmount)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Vendor Amount</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(summary.totalVendorAmount)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <TrendingUp className={`h-8 w-8 ${summary.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  <div>
                    <p className="text-sm text-gray-600">Gross Profit</p>
                    <p className={`text-lg font-semibold ${summary.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(summary.grossProfit)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* View All Orders Button */}
              <div className="mb-6">
                <Button
                  onClick={() => onViewAllOrders(year)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                >
                  <List className="h-4 w-4 mr-2" />
                  View All Orders
                </Button>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Months with data ({summary.orderCount} orders total):
                </p>
                <div className="flex flex-wrap gap-2">
                  {months.map(month => (
                    <Button
                      key={month}
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectMonth(year, month)}
                      className="flex items-center gap-1"
                    >
                      {MONTH_NAMES[month - 1]}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
