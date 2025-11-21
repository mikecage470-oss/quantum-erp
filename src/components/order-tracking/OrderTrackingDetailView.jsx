import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { formatCurrency, formatDate } from '@/lib/utils'
import { 
  ATTENTION_CATEGORIES, 
  STATUS_OPTIONS, 
  PAYMENT_STATUS_OPTIONS, 
  SUPPLY_CHAIN_STAGES,
  CC_USED_OPTIONS,
  CC_CHARGE_RATE
} from '@/config/constants'

export default function OrderTrackingDetailView({ order, isOpen, onClose }) {
  if (!order || !isOpen) return null

  // Calculate financial metrics
  const grossProfit = (order.poAmount || 0) - (order.vendorAmount || 0) - (order.specialExpenses || 0)
  const ccCharge = grossProfit * CC_CHARGE_RATE
  const actualProfit = grossProfit - ccCharge

  // Helper function to get label from value
  const getLabel = (options, value) => {
    const option = options.find(opt => opt.value === value)
    return option ? option.label : value
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500 mt-1">{order.orderId} - {order.customer}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabbed Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General Info</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
              <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            {/* General Info Tab */}
            <TabsContent value="general" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Order Information
                  </h3>
                  <div className="space-y-2">
                    <InfoRow label="Order ID" value={order.orderId} />
                    <InfoRow label="QMS ID" value={order.qmsId} />
                    <InfoRow label="Customer PO" value={order.customerPO} />
                    <InfoRow label="QMS PO" value={order.qmsPO} />
                    <InfoRow label="QMS Invoice" value={order.qmsInvoice || 'N/A'} />
                    <InfoRow 
                      label="Attention Category" 
                      value={<Badge variant="outline">{getLabel(ATTENTION_CATEGORIES, order.attentionCategory)}</Badge>} 
                    />
                    <InfoRow 
                      label="Status" 
                      value={<Badge>{getLabel(STATUS_OPTIONS, order.status)}</Badge>} 
                    />
                    <InfoRow label="Status Detail" value={order.statusDetail} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Customer & Team
                  </h3>
                  <div className="space-y-2">
                    <InfoRow label="Customer" value={order.customer} />
                    <InfoRow label="Customer Name" value={order.customerName} />
                    <InfoRow label="Customer Email" value={order.customerEmail} />
                    <InfoRow label="Hunter" value={order.hunter} />
                    <InfoRow label="Sourcer" value={order.sourcer} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Dates
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="Customer PO Issue Date" value={formatDate(order.customerPOIssueDate)} />
                  <InfoRow label="Submission Date" value={formatDate(order.submissionDate)} />
                  <InfoRow label="Invoice Date" value={order.invoiceDate ? formatDate(order.invoiceDate) : 'N/A'} />
                  <InfoRow label="Customer Delivery Requirement" value={formatDate(order.customerDeliveryRequirementDate)} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Product Details
                </h3>
                <div className="space-y-2">
                  <InfoRow label="Item Description" value={order.itemDescription} />
                  <InfoRow label="Vendor Name" value={order.vendorName} />
                  <InfoRow 
                    label="Vendor Product Link" 
                    value={
                      order.vendorProductLink ? (
                        <a 
                          href={order.vendorProductLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Product
                        </a>
                      ) : 'N/A'
                    } 
                  />
                </div>
              </div>
            </TabsContent>

            {/* Financials Tab */}
            <TabsContent value="financials" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Amounts
                  </h3>
                  <div className="space-y-2">
                    <InfoRow label="PO Amount" value={formatCurrency(order.poAmount)} className="font-semibold" />
                    <InfoRow label="Vendor Amount" value={formatCurrency(order.vendorAmount)} />
                    <InfoRow label="Special Expenses" value={formatCurrency(order.specialExpenses)} />
                    {order.detailsOfSpecialExpense && (
                      <InfoRow label="Special Expense Details" value={order.detailsOfSpecialExpense} />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Calculated Profit
                  </h3>
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    <InfoRow 
                      label="Gross Profit" 
                      value={formatCurrency(grossProfit)} 
                      className="font-medium"
                    />
                    <InfoRow 
                      label="CC Charge (1%)" 
                      value={formatCurrency(ccCharge)} 
                      className="text-sm text-gray-600"
                    />
                    <Separator />
                    <InfoRow 
                      label="Actual Profit" 
                      value={formatCurrency(actualProfit)} 
                      className="font-bold text-lg text-green-600"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Payment Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow 
                    label="CC Used" 
                    value={order.ccUsed ? getLabel(CC_USED_OPTIONS, order.ccUsed) : 'N/A'} 
                  />
                  <InfoRow 
                    label="Payment Status" 
                    value={<Badge variant="outline">{getLabel(PAYMENT_STATUS_OPTIONS, order.paymentStatus)}</Badge>} 
                  />
                  <InfoRow 
                    label="Payment Date" 
                    value={order.paymentDate ? formatDate(order.paymentDate) : 'N/A'} 
                  />
                  <InfoRow 
                    label="Anticipated Cheque Date" 
                    value={order.anticipatedChequeDate ? formatDate(order.anticipatedChequeDate) : 'N/A'} 
                  />
                </div>
              </div>
            </TabsContent>

            {/* Supply Chain Tab */}
            <TabsContent value="supply-chain" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Supply Chain Stage
                </h3>
                <div className="p-6 bg-gray-50 rounded-lg text-center">
                  <Badge className="text-lg px-4 py-2">
                    {getLabel(SUPPLY_CHAIN_STAGES, order.supplyChainStage)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Timeline
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="Customer PO Issue Date" value={formatDate(order.customerPOIssueDate)} />
                  <InfoRow label="Submission Date" value={formatDate(order.submissionDate)} />
                  <InfoRow label="Customer Delivery Requirement" value={formatDate(order.customerDeliveryRequirementDate)} />
                  <InfoRow label="Anticipated Cheque Date" value={order.anticipatedChequeDate ? formatDate(order.anticipatedChequeDate) : 'N/A'} />
                </div>
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Joe's Notes
                  </h3>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">{order.joeNotes || 'No notes'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Jack's Notes
                  </h3>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-700">{order.jackNotes || 'No notes'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Admin Notes
                  </h3>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-700">{order.adminNotes || 'No notes'}</p>
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
