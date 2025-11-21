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
import { Textarea } from '@/components/ui/textarea'
import useInvoiceStore from '@/stores/invoiceStore'
import useCustomerStore from '@/stores/customerStore'
import { Plus, Trash2 } from 'lucide-react'

export default function CreateInvoice({ isOpen, onClose, invoice }) {
  const addInvoice = useInvoiceStore((state) => state.addInvoice)
  const updateInvoice = useInvoiceStore((state) => state.updateInvoice)
  const customers = useCustomerStore((state) => state.customers)

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    notes: '',
    subtotal: 0,
    tax: 0,
    total: 0
  })

  useEffect(() => {
    if (invoice) {
      setFormData(invoice)
    } else {
      setFormData({
        customerId: '',
        customerName: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
        notes: '',
        subtotal: 0,
        tax: 0,
        total: 0
      })
    }
  }, [invoice, isOpen])

  const handleCustomerChange = (customerId) => {
    const customer = customers.find((c) => c.id === customerId)
    setFormData((prev) => ({
      ...prev,
      customerId,
      customerName: customer ? customer.name : ''
    }))
  }

  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.08 // 8% tax
    const total = subtotal + tax
    return { subtotal, tax, total }
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice
    }
    
    const { subtotal, tax, total } = calculateTotals(newItems)
    setFormData((prev) => ({ ...prev, items: newItems, subtotal, tax, total }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    }))
  }

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    const { subtotal, tax, total } = calculateTotals(newItems)
    setFormData((prev) => ({ ...prev, items: newItems, subtotal, tax, total }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (invoice) {
      updateInvoice(invoice.id, formData)
    } else {
      addInvoice(formData)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{invoice ? 'Edit Invoice' : 'Create Invoice'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer *</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={handleCustomerChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Invoice Date *</Label>
                <Input
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, invoiceDate: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Due Date *</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Items</Label>
                <Button type="button" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
              <div className="space-y-2">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Price"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        value={`$${item.total.toFixed(2)}`}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="col-span-1">
                      {formData.items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-y-2">
              <div className="text-right space-y-1">
                <div className="flex justify-between gap-8">
                  <Label>Subtotal:</Label>
                  <span className="font-medium">${formData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between gap-8">
                  <Label>Tax (8%):</Label>
                  <span className="font-medium">${formData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between gap-8 border-t pt-2">
                  <Label>Total:</Label>
                  <span className="text-2xl font-bold">${formData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {invoice ? 'Update' : 'Create'} Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
