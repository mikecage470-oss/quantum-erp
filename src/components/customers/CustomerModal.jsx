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
import useCustomerStore from '@/stores/customerStore'

export default function CustomerModal({ isOpen, onClose, customer }) {
  const addCustomer = useCustomerStore((state) => state.addCustomer)
  const updateCustomer = useCustomerStore((state) => state.updateCustomer)

  const [formData, setFormData] = useState({
    customer: '',
    customerName: '',
    customerEmail: '',
    customerPO: '',
    poAmount: '',
    qmsId: ''
  })

  useEffect(() => {
    if (customer) {
      setFormData({
        customer: customer.customer || '',
        customerName: customer.customerName || '',
        customerEmail: customer.customerEmail || '',
        customerPO: customer.customerPO || '',
        poAmount: customer.poAmount || '',
        qmsId: customer.qmsId || ''
      })
    } else {
      setFormData({
        customer: '',
        customerName: '',
        customerEmail: '',
        customerPO: '',
        poAmount: '',
        qmsId: ''
      })
    }
  }, [customer, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    const dataToSubmit = {
      ...formData,
      poAmount: parseFloat(formData.poAmount) || 0
    }
    if (customer) {
      updateCustomer(customer.id, dataToSubmit)
    } else {
      addCustomer(dataToSubmit)
    }
    onClose()
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{customer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <Input
                id="customer"
                value={formData.customer}
                onChange={(e) => handleChange('customer', e.target.value)}
                placeholder="Company/Organization name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                placeholder="Contact person name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Customer Email *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleChange('customerEmail', e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPO">Customer PO *</Label>
              <Input
                id="customerPO"
                value={formData.customerPO}
                onChange={(e) => handleChange('customerPO', e.target.value)}
                placeholder="Purchase Order number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="poAmount">PO Amount *</Label>
              <Input
                id="poAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.poAmount}
                onChange={(e) => handleChange('poAmount', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qmsId">QMS ID *</Label>
              <Input
                id="qmsId"
                value={formData.qmsId}
                onChange={(e) => handleChange('qmsId', e.target.value)}
                placeholder="QMS identification number"
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {customer ? 'Update' : 'Create'} Customer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
