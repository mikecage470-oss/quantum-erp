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
import useVendorStore from '@/stores/vendorStore'
import { PAYMENT_TERMS } from '@/config/constants'

export default function VendorModal({ isOpen, onClose, vendor }) {
  const addVendor = useVendorStore((state) => state.addVendor)
  const updateVendor = useVendorStore((state) => state.updateVendor)

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    paymentTerms: 'Net 30',
    status: 'Active',
    rating: 0
  })

  useEffect(() => {
    if (vendor) {
      setFormData(vendor)
    } else {
      setFormData({
        name: '',
        contact: '',
        email: '',
        phone: '',
        address: '',
        paymentTerms: 'Net 30',
        status: 'Active',
        rating: 0
      })
    }
  }, [vendor, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (vendor) {
      updateVendor(vendor.id, formData)
    } else {
      addVendor(formData)
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
          <DialogTitle>{vendor ? 'Edit Vendor' : 'Add New Vendor'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
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
              <Label htmlFor="contact">Contact Person *</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => handleChange('contact', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select
                value={formData.paymentTerms}
                onValueChange={(value) => handleChange('paymentTerms', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_TERMS.map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => handleChange('rating', parseFloat(e.target.value) || 0)}
              />
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
