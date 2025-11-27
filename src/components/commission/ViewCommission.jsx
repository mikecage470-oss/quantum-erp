import { X, CheckCircle, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { formatCurrency, formatDate } from '@/lib/utils'
import { COMMISSION_PAYMENT_STATUS, COMMISSION_STATUS } from '@/stores/commissionStore'
import useSettingsStore from '@/stores/settingsStore'

export default function ViewCommission({ commission, isOpen, onClose }) {
  const usdToPkrRate = useSettingsStore((state) => state.usdToPkrRate)

  if (!commission || !isOpen) return null

  // Calculate PKR amount
  const pkrAmount = (commission.commissionAmount || 0) * usdToPkrRate

  // Calculate distribution total
  const distributionTotal = 
    (commission.hunterAmount || 0) + 
    (commission.sourcerAmount || 0) + 
    (commission.submitterAmount || 0) + 
    (commission.executorAmount || 0)

  const isBalanced = Math.abs(distributionTotal - (commission.commissionAmount || 0)) < 0.01

  const getStatusBadge = (status) => {
    const statusOption = COMMISSION_STATUS.find(s => s.value === status)
    if (!statusOption) return <Badge variant="outline">{status}</Badge>
    return <Badge className={`${statusOption.color} text-white`}>{statusOption.label}</Badge>
  }

  const getPaymentStatusBadge = (status) => {
    const statusOption = COMMISSION_PAYMENT_STATUS.find(s => s.value === status)
    if (!statusOption) return <Badge variant="outline">{status}</Badge>
    return <Badge className={`${statusOption.color} text-white`}>{statusOption.label}</Badge>
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="commission-detail-title">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 id="commission-detail-title" className="text-2xl font-bold text-gray-900">Commission Details</h2>
            <p className="text-sm text-gray-500 mt-1">{commission.id} - {commission.customer}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="rounded-full"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabbed Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="financials">Financial Details</TabsTrigger>
              <TabsTrigger value="payment">Payment Tracking</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
            </TabsList>

            {/* Section A: Basic Information */}
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Order Information
                  </h3>
                  <div className="space-y-2">
                    <InfoRow label="Commission ID" value={commission.id} />
                    <InfoRow label="QMS ID" value={commission.qmsId} />
                    <InfoRow label="Customer PO" value={commission.customerPO} />
                    <InfoRow label="Customer" value={commission.customer} />
                    <InfoRow label="Sourcer" value={commission.sourcer} />
                    <InfoRow 
                      label="Status" 
                      value={getStatusBadge(commission.status)} 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Dates
                  </h3>
                  <div className="space-y-2">
                    <InfoRow label="Customer PO Issue Date" value={formatDate(commission.customerPOIssueDate)} />
                    <InfoRow label="Submission Date" value={formatDate(commission.submissionDate)} />
                    <InfoRow label="Anticipated Cheque Date" value={formatDate(commission.anticipatedChequeDate)} />
                    <InfoRow label="Anticipated Payment Date" value={formatDate(commission.anticipatedPaymentDate)} />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Section B: Financial Details */}
            <TabsContent value="financials" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Amounts
                  </h3>
                  <div className="space-y-2">
                    <InfoRow label="PO Amount" value={formatCurrency(commission.poAmount)} className="font-semibold" />
                    <InfoRow label="Vendor Amount" value={formatCurrency(commission.vendorAmount)} />
                    <InfoRow label="Additional Charges" value={formatCurrency(commission.additionalCharges)} />
                    <InfoRow label="CC Charges" value={formatCurrency(commission.ccCharges)} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Profit & Commission
                  </h3>
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    <InfoRow 
                      label="Actual Profit" 
                      value={formatCurrency(commission.actualProfit)} 
                      className="font-medium"
                    />
                    <InfoRow 
                      label={`Commission (${commission.commissionPercent}%)`}
                      value={formatCurrency(commission.commissionAmount)} 
                      className="text-purple-600"
                    />
                    <Separator />
                    <InfoRow 
                      label={`PKR (Rate: ${usdToPkrRate})`}
                      value={`PKR ${pkrAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                      className="font-bold text-lg"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Section C: Payment Tracking */}
            <TabsContent value="payment" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </h3>
                  <div className="space-y-2">
                    <InfoRow 
                      label="Payment Made" 
                      value={getPaymentStatusBadge(commission.paymentMade)} 
                    />
                    <InfoRow label="Anticipated Payment Date" value={formatDate(commission.anticipatedPaymentDate)} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Payment Details
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{commission.paymentDetails || 'No payment details'}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Section D: Commission Distribution */}
            <TabsContent value="distribution" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Distribution Breakdown
                  </h3>
                  <div className={`flex items-center gap-2 ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                    {isBalanced ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Balanced</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Not Balanced</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Hunter */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Hunter</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{commission.hunterName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Percentage:</span>
                        <span className="font-medium">{commission.hunterPercent || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(commission.hunterAmount || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sourcer */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Sourcer</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{commission.sourcerName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Percentage:</span>
                        <span className="font-medium">{commission.sourcerPercent || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(commission.sourcerAmount || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Submitter */}
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Submitter</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{commission.submitterName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Percentage:</span>
                        <span className="font-medium">{commission.submitterPercent || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold text-purple-600">{formatCurrency(commission.submitterAmount || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Executor */}
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Executor</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{commission.executorName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Percentage:</span>
                        <span className="font-medium">{commission.executorPercent || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold text-orange-600">{formatCurrency(commission.executorAmount || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="p-4 bg-gray-100 rounded-lg mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Total Distribution:</span>
                    <span className={`text-xl font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(distributionTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Commission Amount:</span>
                    <span className="font-medium">{formatCurrency(commission.commissionAmount || 0)}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}

// Helper component for info rows
function InfoRow({ label, value, className = '' }) {
  return (
    <div className={`flex justify-between items-start ${className}`}>
      <span className="text-sm text-gray-600 flex-shrink-0 w-1/2">{label}:</span>
      <span className="text-sm font-medium text-right flex-1">{value || 'N/A'}</span>
    </div>
  )
}
