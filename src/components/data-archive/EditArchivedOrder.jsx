import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import useDataArchiveStore from '@/stores/dataArchiveStore'
import { 
  ATTENTION_CATEGORIES, 
  STATUS_OPTIONS, 
  PAYMENT_STATUS_OPTIONS, 
  SUPPLY_CHAIN_STAGES,
  CC_USED_OPTIONS
} from '@/config/constants'

export default function EditArchivedOrder({ order, isOpen, onClose, onSuccess }) {
  const updateArchivedOrder = useDataArchiveStore((state) => state.updateArchivedOrder)
  const [formData, setFormData] = useState({})
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (order) {
      setFormData({ ...order })
      setSaveSuccess(false)
    }
  }, [order])

  const handleSubmit = (e) => {
    e.preventDefault()
    updateArchivedOrder(order.id, formData)
    setSaveSuccess(true)
    
    setTimeout(() => {
      onClose()
      if (onSuccess) onSuccess()
    }, 1000)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!order) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Archived Order - {order.orderId}</DialogTitle>
        </DialogHeader>

        {saveSuccess && (
          <div className="p-3 rounded-md text-sm bg-green-50 text-green-700 border border-green-200">
            Order updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General Info</TabsTrigger>
              <TabsTrigger value="financials">Financial Info</TabsTrigger>
              <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            {/* General Info Tab */}
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderId">Order ID</Label>
                  <Input
                    id="orderId"
                    value={formData.orderId || ''}
                    onChange={(e) => handleChange('orderId', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qmsId">QMS ID</Label>
                  <Input
                    id="qmsId"
                    value={formData.qmsId || ''}
                    onChange={(e) => handleChange('qmsId', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPO">Customer PO</Label>
                  <Input
                    id="customerPO"
                    value={formData.customerPO || ''}
                    onChange={(e) => handleChange('customerPO', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qmsPO">QMS PO</Label>
                  <Input
                    id="qmsPO"
                    value={formData.qmsPO || ''}
                    onChange={(e) => handleChange('qmsPO', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qmsInvoice">QMS Invoice</Label>
                  <Input
                    id="qmsInvoice"
                    value={formData.qmsInvoice || ''}
                    onChange={(e) => handleChange('qmsInvoice', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attentionCategory">Attention Category</Label>
                  <Select 
                    value={formData.attentionCategory || ''} 
                    onValueChange={(value) => handleChange('attentionCategory', value)}
                  >
                    <SelectTrigger id="attentionCategory">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {ATTENTION_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status || ''} 
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(stat => (
                        <SelectItem key={stat.value} value={stat.value}>{stat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statusDetail">Status Detail</Label>
                  <Input
                    id="statusDetail"
                    value={formData.statusDetail || ''}
                    onChange={(e) => handleChange('statusDetail', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Input
                    id="customer"
                    value={formData.customer || ''}
                    onChange={(e) => handleChange('customer', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName || ''}
                    onChange={(e) => handleChange('customerName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail || ''}
                    onChange={(e) => handleChange('customerEmail', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hunter">Hunter</Label>
                  <Input
                    id="hunter"
                    value={formData.hunter || ''}
                    onChange={(e) => handleChange('hunter', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sourcer">Sourcer</Label>
                  <Input
                    id="sourcer"
                    value={formData.sourcer || ''}
                    onChange={(e) => handleChange('sourcer', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="archiveDate">Archive Date</Label>
                  <Input
                    id="archiveDate"
                    type="date"
                    value={formData.archiveDate || ''}
                    onChange={(e) => handleChange('archiveDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPOIssueDate">Customer PO Issue Date</Label>
                  <Input
                    id="customerPOIssueDate"
                    type="date"
                    value={formData.customerPOIssueDate || ''}
                    onChange={(e) => handleChange('customerPOIssueDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="submissionDate">Submission Date</Label>
                  <Input
                    id="submissionDate"
                    type="date"
                    value={formData.submissionDate || ''}
                    onChange={(e) => handleChange('submissionDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceDate">Invoice Date</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={formData.invoiceDate || ''}
                    onChange={(e) => handleChange('invoiceDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerDeliveryRequirementDate">Customer Delivery Requirement Date</Label>
                  <Input
                    id="customerDeliveryRequirementDate"
                    type="date"
                    value={formData.customerDeliveryRequirementDate || ''}
                    onChange={(e) => handleChange('customerDeliveryRequirementDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemDescription">Item Description</Label>
                <Textarea
                  id="itemDescription"
                  value={formData.itemDescription || ''}
                  onChange={(e) => handleChange('itemDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendorName">Vendor Name</Label>
                  <Input
                    id="vendorName"
                    value={formData.vendorName || ''}
                    onChange={(e) => handleChange('vendorName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendorProductLink">Vendor Product Link</Label>
                  <Input
                    id="vendorProductLink"
                    type="url"
                    value={formData.vendorProductLink || ''}
                    onChange={(e) => handleChange('vendorProductLink', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Financials Tab */}
            <TabsContent value="financials" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="poAmount">PO Amount</Label>
                  <Input
                    id="poAmount"
                    type="number"
                    step="0.01"
                    value={formData.poAmount || ''}
                    onChange={(e) => handleChange('poAmount', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendorAmount">Vendor Amount</Label>
                  <Input
                    id="vendorAmount"
                    type="number"
                    step="0.01"
                    value={formData.vendorAmount || ''}
                    onChange={(e) => handleChange('vendorAmount', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialExpenses">Special Expenses</Label>
                  <Input
                    id="specialExpenses"
                    type="number"
                    step="0.01"
                    value={formData.specialExpenses || ''}
                    onChange={(e) => handleChange('specialExpenses', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ccChargeRate">CC Charge Rate (e.g., 0.01 for 1%)</Label>
                  <Input
                    id="ccChargeRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={formData.ccChargeRate ?? 0.01}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value)
                      const validValue = isNaN(value) ? 0.01 : Math.max(0, Math.min(1, value))
                      handleChange('ccChargeRate', validValue)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ccUsed">CC Used</Label>
                  <Select 
                    value={formData.ccUsed || ''} 
                    onValueChange={(value) => handleChange('ccUsed', value)}
                  >
                    <SelectTrigger id="ccUsed">
                      <SelectValue placeholder="Select credit card" />
                    </SelectTrigger>
                    <SelectContent>
                      {CC_USED_OPTIONS.map(cc => (
                        <SelectItem key={cc.value} value={cc.value}>{cc.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select 
                    value={formData.paymentStatus || ''} 
                    onValueChange={(value) => handleChange('paymentStatus', value)}
                  >
                    <SelectTrigger id="paymentStatus">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_STATUS_OPTIONS.map(ps => (
                        <SelectItem key={ps.value} value={ps.value}>{ps.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Payment Date</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={formData.paymentDate || ''}
                    onChange={(e) => handleChange('paymentDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="anticipatedChequeDate">Anticipated Cheque Date</Label>
                  <Input
                    id="anticipatedChequeDate"
                    type="date"
                    value={formData.anticipatedChequeDate || ''}
                    onChange={(e) => handleChange('anticipatedChequeDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailsOfSpecialExpense">Details of Special Expense</Label>
                <Textarea
                  id="detailsOfSpecialExpense"
                  value={formData.detailsOfSpecialExpense || ''}
                  onChange={(e) => handleChange('detailsOfSpecialExpense', e.target.value)}
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Supply Chain Tab */}
            <TabsContent value="supply-chain" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="supplyChainStage">Supply Chain Stage</Label>
                <Select 
                  value={formData.supplyChainStage || ''} 
                  onValueChange={(value) => handleChange('supplyChainStage', value)}
                >
                  <SelectTrigger id="supplyChainStage">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPLY_CHAIN_STAGES.map(stage => (
                      <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="joeNotes">Joe&apos;s Notes</Label>
                <Textarea
                  id="joeNotes"
                  value={formData.joeNotes || ''}
                  onChange={(e) => handleChange('joeNotes', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jackNotes">Jack&apos;s Notes</Label>
                <Textarea
                  id="jackNotes"
                  value={formData.jackNotes || ''}
                  onChange={(e) => handleChange('jackNotes', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea
                  id="adminNotes"
                  value={formData.adminNotes || ''}
                  onChange={(e) => handleChange('adminNotes', e.target.value)}
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveSuccess}>Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
