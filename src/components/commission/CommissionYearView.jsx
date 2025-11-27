import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { MONTH_NAMES } from '@/config/constants'
import useCommissionStore from '@/stores/commissionStore'
import { Calendar, ChevronRight, DollarSign, TrendingUp, List, Percent } from 'lucide-react'

export default function CommissionYearView({ onSelectMonth, onViewAllCommissions }) {
  const { commissions, getAllYears, getYearSummary, getMonthsForYear } = useCommissionStore()
  const years = useMemo(() => getAllYears(), [commissions])

  if (years.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Percent className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Commission Records</h3>
          <p className="text-gray-600">
            There are no commission records yet. Commission records are automatically created 
            when orders are added in Order Tracking.
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
            <CardHeader className="bg-purple-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
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
                  <TrendingUp className={`h-8 w-8 ${summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  <div>
                    <p className="text-sm text-gray-600">Net Profit</p>
                    <p className={`text-lg font-semibold ${summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(summary.netProfit)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* View All Commissions Button */}
              <div className="mb-6">
                <Button
                  onClick={() => onViewAllCommissions(year)}
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
                >
                  <List className="h-4 w-4 mr-2" />
                  View All Commissions
                </Button>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Months with data ({summary.commissionCount} records total):
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
