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
import usePOStore from '@/stores/poStore'
import useVendorStore from '@/stores/vendorStore'
import { Plus, Trash2 } from 'lucide-react'

export default function CreatePO({ isOpen, onClose, po }) {
  const addPurchaseOrder = usePOStore((state) => state.addPurchaseOrder)
  const updatePurchaseOrder = usePOStore((state) => state.updatePurchaseOrder)
  const vendors = useVendorStore((state) => state.vendors)

  const [formData, setFormData] = useState({
    vendorId: '',
    vendorName: '',
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    notes: '',
    total: 0
  })

  useEffect(() => {
    if (po) {
      setFormData(po)
    } else {
      setFormData({
        vendorId: '',
        vendorName: '',
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: '',
        items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
        notes: '',
        total: 0
      })
    }
  }, [po, isOpen])

  const handleVendorChange = (vendorId) => {
    const vendor = vendors.find((v) => v.id === vendorId)
    setFormData((prev) => ({
      ...prev,
      vendorId,
      vendorName: vendor ? vendor.name : ''
    }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice
    }
    
    const total = newItems.reduce((sum, item) => sum + item.total, 0)
    setFormData((prev) => ({ ...prev, items: newItems, total }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    }))
  }

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    const total = newItems.reduce((sum, item) => sum + item.total, 0)
    setFormData((prev) => ({ ...prev, items: newItems, total }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (po) {
      updatePurchaseOrder(po.id, formData)
    } else {
      addPurchaseOrder(formData)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{po ? 'Edit Purchase Order' : 'Create Purchase Order'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vendor *</Label>
                <Select
                  value={formData.vendorId}
                  onValueChange={handleVendorChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Order Date *</Label>
                <Input
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, orderDate: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Delivery Date *</Label>
                <Input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, deliveryDate: e.target.value }))}
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

            <div className="flex justify-end">
              <div className="text-right">
                <Label>Total Amount</Label>
                <div className="text-2xl font-bold">${formData.total.toFixed(2)}</div>
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
              {po ? 'Update' : 'Create'} Purchase Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
