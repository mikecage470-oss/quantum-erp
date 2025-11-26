import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useVendorStore from '@/stores/vendorStore'
import { PAYMENT_STATUS_OPTIONS } from '@/config/constants'

export default function VendorModal({ isOpen, onClose, vendor }) {
  const addVendor = useVendorStore((state) => state.addVendor)
  const updateVendor = useVendorStore((state) => state.updateVendor)
  const findOrderByQmsId = useVendorStore((state) => state.findOrderByQmsId)

  const [formData, setFormData] = useState({
    name: '',
    vendorProductLink: '',
    vendorAmount: '',
    specialExpense: '',
    qmsId: '',
    paymentStatus: 'due'
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || '',
        vendorProductLink: vendor.vendorProductLink || '',
        vendorAmount: vendor.vendorAmount || '',
        specialExpense: vendor.specialExpense || '',
        qmsId: vendor.qmsId || '',
        paymentStatus: vendor.paymentStatus || 'due'
      })
    } else {
      setFormData({
        name: '',
        vendorProductLink: '',
        vendorAmount: '',
        specialExpense: '',
        qmsId: '',
        paymentStatus: 'due'
      })
    }
    setMessage({ type: '', text: '' })
  }, [vendor, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const vendorData = {
      ...formData,
      vendorAmount: parseFloat(formData.vendorAmount) || 0,
      specialExpense: parseFloat(formData.specialExpense) || 0
    }

    if (vendor) {
      // Editing existing vendor - just update, don't auto-update order
      updateVendor(vendor.id, vendorData)
      onClose()
    } else {
      // Adding new vendor - check for matching order and auto-update
      const matchingOrder = findOrderByQmsId(formData.qmsId)
      
      if (!matchingOrder) {
        setMessage({
          type: 'warning',
          text: `No matching order found for QMS ID "${formData.qmsId}". Vendor created but no order was updated.`
        })
      }
      
      const result = addVendor(vendorData)
      
      if (result.orderUpdated) {
        setMessage({
          type: 'success',
          text: `Vendor created and order ${result.orderId} updated successfully!`
        })
      }
      
      // Close after a short delay so user can see the message
      setTimeout(() => {
        onClose()
      }, matchingOrder ? 1500 : 2000)
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{vendor ? 'Edit Vendor' : 'Add New Vendor'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {message.text && (
            <div className={`mb-4 p-3 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-800' :
              message.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {message.text}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Vendor Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendorProductLink">Vendor Product Link</Label>
              <Input
                id="vendorProductLink"
                type="url"
                value={formData.vendorProductLink}
                onChange={(e) => handleChange('vendorProductLink', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendorAmount">Vendor Amount ($) *</Label>
              <Input
                id="vendorAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.vendorAmount}
                onChange={(e) => handleChange('vendorAmount', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialExpense">Special Expense ($)</Label>
              <Input
                id="specialExpense"
                type="number"
                min="0"
                step="0.01"
                value={formData.specialExpense}
                onChange={(e) => handleChange('specialExpense', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qmsId">QMS ID *</Label>
              <Input
                id="qmsId"
                value={formData.qmsId}
                onChange={(e) => handleChange('qmsId', e.target.value)}
                placeholder="QMS-XXXX"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status *</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value) => handleChange('paymentStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {vendor ? 'Update' : 'Create'} Vendor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
