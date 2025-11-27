import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, AlertCircle } from 'lucide-react'
import useCommissionStore, { COMMISSION_PAYMENT_STATUS, COMMISSION_STATUS } from '@/stores/commissionStore'
import useSettingsStore from '@/stores/settingsStore'
import { formatCurrency } from '@/lib/utils'

export default function EditCommission({ commission, isOpen, onClose }) {
  const updateCommission = useCommissionStore((state) => state.updateCommission)
  const usdToPkrRate = useSettingsStore((state) => state.usdToPkrRate)
  const [formData, setFormData] = useState({})
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (commission) {
      setFormData({ ...commission })
      setSaveSuccess(false)
    }
  }, [commission])

  // Calculate actual profit and commission when values change
  useEffect(() => {
    if (formData.poAmount !== undefined) {
      const actualProfit = (formData.poAmount || 0) - (formData.vendorAmount || 0) - (formData.additionalCharges || 0) - (formData.ccCharges || 0)
      const commissionAmount = actualProfit * ((formData.commissionPercent || 20) / 100)
      
      setFormData(prev => ({
        ...prev,
        actualProfit,
        commissionAmount
      }))
    }
  }, [formData.poAmount, formData.vendorAmount, formData.additionalCharges, formData.ccCharges, formData.commissionPercent])

  // Calculate distribution amounts when percentages change
  useEffect(() => {
    if (formData.commissionAmount !== undefined) {
      const commissionAmount = formData.commissionAmount || 0
      const hunterAmount = commissionAmount * ((formData.hunterPercent || 0) / 100)
      const sourcerAmount = commissionAmount * ((formData.sourcerPercent || 0) / 100)
      const submitterAmount = commissionAmount * ((formData.submitterPercent || 0) / 100)
      const executorAmount = commissionAmount * ((formData.executorPercent || 0) / 100)
      
      setFormData(prev => ({
        ...prev,
        hunterAmount,
        sourcerAmount,
        submitterAmount,
        executorAmount
      }))
    }
  }, [formData.commissionAmount, formData.hunterPercent, formData.sourcerPercent, formData.submitterPercent, formData.executorPercent])

  const handleSubmit = (e) => {
    e.preventDefault()
    updateCommission(commission.id, formData)
    setSaveSuccess(true)
    
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!commission) return null

  // Calculate distribution validation
  const distributionTotal = 
    (formData.hunterAmount || 0) + 
    (formData.sourcerAmount || 0) + 
    (formData.submitterAmount || 0) + 
    (formData.executorAmount || 0)
  const isBalanced = Math.abs(distributionTotal - (formData.commissionAmount || 0)) < 0.01
  const percentageTotal = (formData.hunterPercent || 0) + (formData.sourcerPercent || 0) + (formData.submitterPercent || 0) + (formData.executorPercent || 0)

  // Calculate PKR
  const pkrAmount = (formData.commissionAmount || 0) * usdToPkrRate

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Commission - {commission.id}</DialogTitle>
        </DialogHeader>

        {saveSuccess && (
          <div className="p-3 rounded-md text-sm bg-green-50 text-green-700 border border-green-200">
            Commission updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="financials">Financial Details</TabsTrigger>
              <TabsTrigger value="payment">Payment Tracking</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
            </TabsList>

            {/* Section A: Basic Information */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qmsId">QMS ID</Label>
                  <Input
                    id="qmsId"
                    value={formData.qmsId || ''}
                    onChange={(e) => handleChange('qmsId', e.target.value)}
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
                  <Label htmlFor="submissionDate">Submission Date</Label>
                  <Input
                    id="submissionDate"
                    type="date"
                    value={formData.submissionDate || ''}
                    onChange={(e) => handleChange('submissionDate', e.target.value)}
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
                  <Label htmlFor="customerPOIssueDate">Customer PO Issue Date</Label>
                  <Input
                    id="customerPOIssueDate"
                    type="date"
                    value={formData.customerPOIssueDate || ''}
                    onChange={(e) => handleChange('customerPOIssueDate', e.target.value)}
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
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status || ''} 
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMISSION_STATUS.map(status => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            </TabsContent>

            {/* Section B: Financial Details */}
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
                  <Label htmlFor="additionalCharges">Additional Charges</Label>
                  <Input
                    id="additionalCharges"
                    type="number"
                    step="0.01"
                    value={formData.additionalCharges || ''}
                    onChange={(e) => handleChange('additionalCharges', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ccCharges">CC Charges</Label>
                  <Input
                    id="ccCharges"
                    type="number"
                    step="0.01"
                    value={formData.ccCharges || ''}
                    onChange={(e) => handleChange('ccCharges', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Actual Profit (Auto-calculated)</Label>
                  <div className={`p-3 rounded-md ${(formData.actualProfit || 0) >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {formatCurrency(formData.actualProfit || 0)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commissionPercent">Commission % (Default: 20%)</Label>
                  <Input
                    id="commissionPercent"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.commissionPercent || 20}
                    onChange={(e) => handleChange('commissionPercent', parseFloat(e.target.value) || 20)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Commission Amount (Auto-calculated)</Label>
                  <div className="p-3 rounded-md bg-purple-50 text-purple-700 font-semibold">
                    {formatCurrency(formData.commissionAmount || 0)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>PKR Amount (Rate: {usdToPkrRate})</Label>
                  <div className="p-3 rounded-md bg-gray-100 text-gray-700 font-semibold">
                    PKR {pkrAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Section C: Payment Tracking */}
            <TabsContent value="payment" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="anticipatedPaymentDate">Anticipated Payment Date</Label>
                  <Input
                    id="anticipatedPaymentDate"
                    type="date"
                    value={formData.anticipatedPaymentDate || ''}
                    onChange={(e) => handleChange('anticipatedPaymentDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMade">Payment Made</Label>
                  <Select 
                    value={formData.paymentMade || 'pending'} 
                    onValueChange={(value) => handleChange('paymentMade', value)}
                  >
                    <SelectTrigger id="paymentMade">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMISSION_PAYMENT_STATUS.map(status => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentDetails">Payment Details</Label>
                <Textarea
                  id="paymentDetails"
                  value={formData.paymentDetails || ''}
                  onChange={(e) => handleChange('paymentDetails', e.target.value)}
                  rows={4}
                  placeholder="Enter payment details, notes, or reference numbers..."
                />
              </div>
            </TabsContent>

            {/* Section D: Commission Distribution */}
            <TabsContent value="distribution" className="space-y-4">
              {/* Validation Status */}
              <div className={`p-4 rounded-md flex items-center gap-3 ${isBalanced ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                {isBalanced ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-700">Distribution is balanced. Total: {formatCurrency(distributionTotal)}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-700">
                      Distribution not balanced. Total: {formatCurrency(distributionTotal)} (Expected: {formatCurrency(formData.commissionAmount || 0)})
                    </span>
                  </>
                )}
              </div>

              <div className="text-sm text-gray-600 mb-4">
                Total Percentage: {percentageTotal}% {percentageTotal === 100 ? '✓' : `(${100 - percentageTotal}% remaining)`}
              </div>

              {/* Hunter */}
              <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                <h4 className="font-semibold text-blue-800">Hunter</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hunterName">Name</Label>
                    <Input
                      id="hunterName"
                      value={formData.hunterName || ''}
                      onChange={(e) => handleChange('hunterName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hunterPercent">% Applied</Label>
                    <Input
                      id="hunterPercent"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.hunterPercent || ''}
                      onChange={(e) => handleChange('hunterPercent', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (Auto)</Label>
                    <div className="p-2 rounded-md bg-white text-blue-600 font-semibold">
                      {formatCurrency(formData.hunterAmount || 0)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sourcer */}
              <div className="p-4 bg-green-50 rounded-lg space-y-3">
                <h4 className="font-semibold text-green-800">Sourcer</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sourcerName">Name</Label>
                    <Input
                      id="sourcerName"
                      value={formData.sourcerName || ''}
                      onChange={(e) => handleChange('sourcerName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sourcerPercent">% Applied</Label>
                    <Input
                      id="sourcerPercent"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.sourcerPercent || ''}
                      onChange={(e) => handleChange('sourcerPercent', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (Auto)</Label>
                    <div className="p-2 rounded-md bg-white text-green-600 font-semibold">
                      {formatCurrency(formData.sourcerAmount || 0)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submitter */}
              <div className="p-4 bg-purple-50 rounded-lg space-y-3">
                <h4 className="font-semibold text-purple-800">Submitter</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="submitterName">Name</Label>
                    <Input
                      id="submitterName"
                      value={formData.submitterName || ''}
                      onChange={(e) => handleChange('submitterName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="submitterPercent">% Applied</Label>
                    <Input
                      id="submitterPercent"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.submitterPercent || ''}
                      onChange={(e) => handleChange('submitterPercent', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (Auto)</Label>
                    <div className="p-2 rounded-md bg-white text-purple-600 font-semibold">
                      {formatCurrency(formData.submitterAmount || 0)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Executor */}
              <div className="p-4 bg-orange-50 rounded-lg space-y-3">
                <h4 className="font-semibold text-orange-800">Executor</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="executorName">Name</Label>
                    <Input
                      id="executorName"
                      value={formData.executorName || ''}
                      onChange={(e) => handleChange('executorName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="executorPercent">% Applied</Label>
                    <Input
                      id="executorPercent"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.executorPercent || ''}
                      onChange={(e) => handleChange('executorPercent', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (Auto)</Label>
                    <div className="p-2 rounded-md bg-white text-orange-600 font-semibold">
                      {formatCurrency(formData.executorAmount || 0)}
                    </div>
                  </div>
                </div>
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
