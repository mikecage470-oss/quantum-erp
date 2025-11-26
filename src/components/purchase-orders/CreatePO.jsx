import { useState, useEffect, useRef } from 'react'
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
import useOrderTrackingStore from '@/stores/orderTrackingStore'
import { Plus, Trash2, Download, Upload, X } from 'lucide-react'
import { PAYMENT_TERMS } from '@/config/constants'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const DEFAULT_COMPANY_NAME = 'Quantum Concierge Services LLC'
const DEFAULT_COMPANY_ADDRESS = '208 Somersly PL, Lexington KY, 40515'
const DEFAULT_TERMS_AND_CONDITIONS = `This Purchase Order (PO) is valid for 15 days from the date of issuance. Seller must comply with all applicable federal, state, and local laws, including U.S. government procurement regulations. Goods/services must meet PO specifications and delivery schedules. Buyer reserves the right to inspect, reject, and return non-compliant items at the Seller's expense. The PO number must be referenced on all invoices, packing slips, and related documents. Payment will be processed upon verification of delivered goods/services or as agreed between Buyer and Seller. Discrepancies may delay payment. Seller is responsible for any restocking fees or return shipping costs due to errors on their part. All express and implied warranties shall apply in accordance with industry standards and the Seller's terms. Buyer reserves the right to request proof of origin, compliance certifications, or test reports before accepting goods. Seller must maintain confidentiality and comply with cybersecurity and export control laws where applicable. Seller shall indemnify and hold harmless the Buyer from any claims, damages, or liabilities related to the goods/services provided. Buyer reserves the right to modify or cancel this PO before shipment or service completion, with notice to the Seller. Neither party is liable for delays due to uncontrollable events (e.g., natural disasters, government actions).`

const SHIPPING_METHODS = ['Ground', 'Express', 'Air Freight', 'Overnight', 'Freight', 'Pick Up']

export default function CreatePO({ isOpen, onClose, po }) {
  const addPurchaseOrder = usePOStore((state) => state.addPurchaseOrder)
  const updatePurchaseOrder = usePOStore((state) => state.updatePurchaseOrder)
  const vendors = useVendorStore((state) => state.vendors)
  const orders = useOrderTrackingStore((state) => state.orders)
  const updateOrder = useOrderTrackingStore((state) => state.updateOrder)
  const fileInputRef = useRef(null)

  const getInitialFormData = () => ({
    // Section A: Company Information
    companyName: DEFAULT_COMPANY_NAME,
    companyAddress: DEFAULT_COMPANY_ADDRESS,
    // Section B: Vendor Information
    vendorId: '',
    vendorName: '',
    vendorAddress: '',
    // Section C: PO Details
    orderDate: new Date().toISOString().split('T')[0],
    qmsId: '',
    qmsPO: '',
    shipToAddress: '',
    paymentTerms: 'Net 30',
    shippingMethod: 'Ground',
    deliveryDate: '',
    // Section D: Items
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    // Section E: Financial
    subtotal: 0,
    taxRate: 0,
    discount: 0,
    shipping: 0,
    total: 0,
    // Section F: Terms
    termsAndConditions: DEFAULT_TERMS_AND_CONDITIONS,
    // Section G: Logo
    companyLogo: '',
    // Notes (kept for backward compatibility)
    notes: ''
  })

  const [formData, setFormData] = useState(getInitialFormData())
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)

  useEffect(() => {
    if (po) {
      setFormData({
        ...getInitialFormData(),
        ...po,
        companyName: po.companyName || DEFAULT_COMPANY_NAME,
        companyAddress: po.companyAddress || DEFAULT_COMPANY_ADDRESS,
        termsAndConditions: po.termsAndConditions || DEFAULT_TERMS_AND_CONDITIONS,
        taxRate: po.taxRate || 0,
        discount: po.discount || 0,
        shipping: po.shipping || 0
      })
      if (po.companyLogo) {
        setLogoPreview(po.companyLogo)
      }
    } else {
      setFormData(getInitialFormData())
      setLogoPreview(null)
    }
  }, [po, isOpen])

  // Recalculate totals whenever items or financial fields change
  useEffect(() => {
    calculateTotals()
  }, [formData.items, formData.taxRate, formData.discount, formData.shipping])

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.total || 0), 0)
    const taxAmount = subtotal * (formData.taxRate / 100)
    const total = subtotal + taxAmount - formData.discount + formData.shipping

    setFormData((prev) => ({
      ...prev,
      subtotal,
      total: Math.max(0, total)
    }))
  }

  const handleVendorChange = (vendorId) => {
    const vendor = vendors.find((v) => v.id === vendorId)
    setFormData((prev) => ({
      ...prev,
      vendorId,
      vendorName: vendor ? vendor.name : '',
      vendorAddress: vendor ? (vendor.vendorAddress || '') : ''
    }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value

    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice
    }

    setFormData((prev) => ({ ...prev, items: newItems }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    }))
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, items: newItems }))
    }
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
      if (!validTypes.includes(file.type)) {
        alert('Please upload a PNG, JPG, JPEG, or SVG file.')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result
        setFormData((prev) => ({ ...prev, companyLogo: base64 }))
        setLogoPreview(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setFormData((prev) => ({ ...prev, companyLogo: '' }))
    setLogoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.vendorName) {
      alert('Please select a vendor.')
      return
    }
    if (!formData.deliveryDate) {
      alert('Please enter a delivery date.')
      return
    }
    if (!formData.vendorAddress) {
      alert('Please enter a vendor address.')
      return
    }
    if (formData.items.length === 0 || !formData.items[0].description) {
      alert('Please add at least one item.')
      return
    }

    // Update or add PO
    if (po) {
      updatePurchaseOrder(po.id, formData)
    } else {
      addPurchaseOrder(formData)
    }

    // Integration with Order Tracking - Update qmsPO field
    if (formData.qmsId && formData.qmsPO) {
      const matchingOrder = orders.find((order) => order.qmsId === formData.qmsId)
      if (matchingOrder) {
        updateOrder(matchingOrder.id, { qmsPO: formData.qmsPO })
      }
    }

    onClose()
  }

  const generatePDF = () => {
    setIsGeneratingPDF(true)

    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      let yPos = 20

      // Header Section
      // Company logo (if uploaded) - scaled down to appropriate size
      if (formData.companyLogo) {
        try {
          doc.addImage(formData.companyLogo, 'PNG', 15, yPos, 25, 25)
        } catch {
          // If logo fails to load, continue without it
        }
      }

      // Company name and address (right side)
      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text(formData.companyName, pageWidth - 15, yPos, { align: 'right' })
      doc.text(formData.companyAddress, pageWidth - 15, yPos + 5, { align: 'right' })

      yPos += 30

      // PURCHASE ORDER title
      doc.setFontSize(22)
      doc.setTextColor(0)
      doc.setFont(undefined, 'bold')
      doc.text('PURCHASE ORDER', pageWidth / 2, yPos, { align: 'center' })

      yPos += 15

      // PO Number and Date
      doc.setFontSize(11)
      doc.setFont(undefined, 'normal')
      doc.text(`PO Number: ${po?.id || 'NEW'}`, pageWidth - 15, yPos, { align: 'right' })
      doc.text(`Date: ${formData.orderDate}`, pageWidth - 15, yPos + 6, { align: 'right' })
      if (formData.qmsPO) {
        doc.text(`QMS PO: ${formData.qmsPO}`, pageWidth - 15, yPos + 12, { align: 'right' })
      }

      yPos += 25

      // Vendor Section
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('Vendor:', 15, yPos)
      doc.setFont(undefined, 'normal')
      doc.setFontSize(10)
      doc.text(formData.vendorName, 15, yPos + 6)
      const vendorAddressLines = doc.splitTextToSize(formData.vendorAddress, 80)
      doc.text(vendorAddressLines, 15, yPos + 12)

      // Ship To (if provided)
      if (formData.shipToAddress) {
        doc.setFontSize(12)
        doc.setFont(undefined, 'bold')
        doc.text('Ship To:', 110, yPos)
        doc.setFont(undefined, 'normal')
        doc.setFontSize(10)
        const shipToLines = doc.splitTextToSize(formData.shipToAddress, 80)
        doc.text(shipToLines, 110, yPos + 6)
      }

      yPos += 35

      // PO Details Section
      doc.setFontSize(10)
      doc.setFont(undefined, 'bold')
      doc.text('Payment Terms:', 15, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(formData.paymentTerms, 55, yPos)

      doc.setFont(undefined, 'bold')
      doc.text('Shipping Method:', 110, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(formData.shippingMethod, 150, yPos)

      yPos += 7
      doc.setFont(undefined, 'bold')
      doc.text('Delivery Date:', 15, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(formData.deliveryDate, 55, yPos)

      yPos += 15

      // Items Table
      const tableData = formData.items.map((item, index) => [
        index + 1,
        item.description,
        item.quantity,
        `$${item.unitPrice.toFixed(2)}`,
        `$${item.total.toFixed(2)}`
      ])

      const tableWidth = pageWidth - 30 // Full width minus margins (15 on each side)
      doc.autoTable({
        startY: yPos,
        head: [['Item #', 'Description', 'QTY', 'Unit Price', 'Total']],
        body: tableData,
        theme: 'striped',
        margin: { left: 15, right: 15 },
        tableWidth: tableWidth,
        headStyles: {
          fillColor: [51, 51, 51],
          textColor: 255,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: tableWidth * 0.08, halign: 'center' },
          1: { cellWidth: tableWidth * 0.52 },
          2: { cellWidth: tableWidth * 0.10, halign: 'center' },
          3: { cellWidth: tableWidth * 0.15, halign: 'right' },
          4: { cellWidth: tableWidth * 0.15, halign: 'right' }
        },
        styles: {
          fontSize: 9,
          cellPadding: 3
        }
      })

      yPos = doc.lastAutoTable.finalY + 15

      // Financial Summary (right-aligned)
      const summaryX = pageWidth - 70
      doc.setFontSize(10)

      doc.text('Subtotal:', summaryX, yPos)
      doc.text(`$${formData.subtotal.toFixed(2)}`, pageWidth - 15, yPos, { align: 'right' })

      yPos += 6
      doc.text(`Tax (${formData.taxRate}%):`, summaryX, yPos)
      const taxAmount = formData.subtotal * (formData.taxRate / 100)
      doc.text(`$${taxAmount.toFixed(2)}`, pageWidth - 15, yPos, { align: 'right' })

      if (formData.discount > 0) {
        yPos += 6
        doc.text('Discount:', summaryX, yPos)
        doc.text(`-$${formData.discount.toFixed(2)}`, pageWidth - 15, yPos, { align: 'right' })
      }

      if (formData.shipping > 0) {
        yPos += 6
        doc.text('Shipping:', summaryX, yPos)
        doc.text(`$${formData.shipping.toFixed(2)}`, pageWidth - 15, yPos, { align: 'right' })
      }

      yPos += 8
      doc.setFont(undefined, 'bold')
      doc.setFontSize(12)
      doc.text('Total:', summaryX, yPos)
      doc.text(`$${formData.total.toFixed(2)}`, pageWidth - 15, yPos, { align: 'right' })

      // Terms and Conditions (full width, smaller font, positioned at bottom of last page)
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 15
      const termsWidth = pageWidth - (margin * 2)
      
      // Calculate terms height first
      doc.setFontSize(7)
      doc.setFont(undefined, 'bold')
      const titleHeight = 6
      doc.setFont(undefined, 'normal')
      doc.setFontSize(6)
      const termsLines = doc.splitTextToSize(formData.termsAndConditions, termsWidth)
      const lineHeight = 3
      const termsTextHeight = termsLines.length * lineHeight
      const totalTermsHeight = titleHeight + termsTextHeight + 10 // 10 for padding
      
      // Calculate where to position terms (at bottom of page)
      const bottomMargin = 10
      const termsStartY = pageHeight - bottomMargin - totalTermsHeight
      
      // Check if we need to add a new page or if terms fit on current page
      const contentEndY = yPos + 20
      if (contentEndY > termsStartY) {
        // Content overlaps with where terms should be, add a new page
        doc.addPage()
        yPos = pageHeight - bottomMargin - totalTermsHeight
      } else {
        // Position terms at bottom of current page
        yPos = termsStartY
      }
      
      // Render Terms and Conditions
      doc.setFontSize(7)
      doc.setFont(undefined, 'bold')
      doc.text('Terms and Conditions:', margin, yPos)
      doc.setFont(undefined, 'normal')
      doc.setFontSize(6)
      yPos += titleHeight
      doc.text(termsLines, margin, yPos)

      // Generate filename and save
      const filename = `PO-${po?.id || 'NEW'}-${formData.orderDate}.pdf`
      doc.save(filename)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{po ? 'Edit Purchase Order' : 'Create Purchase Order'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Section A: Company Information */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-md font-semibold mb-3 text-gray-700">Company Information (Buyer)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Address</Label>
                  <Textarea
                    value={formData.companyAddress}
                    onChange={(e) => setFormData((prev) => ({ ...prev, companyAddress: e.target.value }))}
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Section B: Vendor Information */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="text-md font-semibold mb-3 text-blue-700">Vendor Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vendor Name *</Label>
                  <Select
                    value={formData.vendorId}
                    onValueChange={handleVendorChange}
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
                  <Label>Vendor Address *</Label>
                  <Textarea
                    value={formData.vendorAddress}
                    onChange={(e) => setFormData((prev) => ({ ...prev, vendorAddress: e.target.value }))}
                    rows={2}
                    placeholder="Enter vendor address"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section C: PO Details */}
            <div className="border rounded-lg p-4 bg-green-50">
              <h3 className="text-md font-semibold mb-3 text-green-700">PO Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>PO Date</Label>
                  <Input
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, orderDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>QMS ID</Label>
                  <Input
                    value={formData.qmsId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, qmsId: e.target.value }))}
                    placeholder="e.g., QMS-0001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>QMS PO</Label>
                  <Input
                    value={formData.qmsPO}
                    onChange={(e) => setFormData((prev) => ({ ...prev, qmsPO: e.target.value }))}
                    placeholder="e.g., QMS-PO-001"
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
                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <Select
                    value={formData.paymentTerms}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentTerms: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment terms" />
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
                  <Label>Shipping Method</Label>
                  <Select
                    value={formData.shippingMethod}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, shippingMethod: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shipping method" />
                    </SelectTrigger>
                    <SelectContent>
                      {SHIPPING_METHODS.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3 space-y-2">
                  <Label>Ship to Address</Label>
                  <Textarea
                    value={formData.shipToAddress}
                    onChange={(e) => setFormData((prev) => ({ ...prev, shipToAddress: e.target.value }))}
                    rows={2}
                    placeholder="Enter shipping address (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Section D: Items */}
            <div className="border rounded-lg p-4 bg-purple-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold text-purple-700">Items</h3>
                <Button type="button" size="sm" onClick={addItem} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-1">
                  <div className="col-span-1">Item #</div>
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2">QTY</div>
                  <div className="col-span-2">Unit Price</div>
                  <div className="col-span-1">Total</div>
                  <div className="col-span-1"></div>
                </div>
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-1">
                      <Input
                        value={index + 1}
                        readOnly
                        className="bg-gray-100 text-center"
                      />
                    </div>
                    <div className="col-span-5">
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Qty"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Price"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        value={`$${item.total.toFixed(2)}`}
                        readOnly
                        className="bg-gray-100"
                      />
                    </div>
                    <div className="col-span-1">
                      {formData.items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section E: Financial Calculations */}
            <div className="border rounded-lg p-4 bg-yellow-50">
              <h3 className="text-md font-semibold mb-3 text-yellow-700">Financial Summary</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Subtotal</Label>
                  <Input
                    value={`$${formData.subtotal.toFixed(2)}`}
                    readOnly
                    className="bg-gray-100 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.taxRate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                    placeholder="e.g., 8.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Discount ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Shipping ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.shipping}
                    onChange={(e) => setFormData((prev) => ({ ...prev, shipping: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <div className="text-right">
                  <Label className="text-sm text-gray-500">Total Amount</Label>
                  <div className="text-3xl font-bold text-green-600">${formData.total.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Section F: Terms and Conditions */}
            <div className="border rounded-lg p-4 bg-orange-50">
              <h3 className="text-md font-semibold mb-3 text-orange-700">Terms and Conditions</h3>
              <Textarea
                value={formData.termsAndConditions}
                onChange={(e) => setFormData((prev) => ({ ...prev, termsAndConditions: e.target.value }))}
                rows={6}
                className="text-sm"
              />
            </div>

            {/* Section G: Company Logo Upload */}
            <div className="border rounded-lg p-4 bg-pink-50">
              <h3 className="text-md font-semibold mb-3 text-pink-700">Company Logo</h3>
              <div className="flex items-center gap-4">
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".png,.jpg,.jpeg,.svg"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG, or SVG</p>
                </div>
                {logoPreview && (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Company Logo Preview"
                      className="h-16 max-w-[200px] object-contain border rounded"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Notes (optional, for backward compatibility) */}
            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                rows={2}
                placeholder="Any additional notes..."
              />
            </div>
          </div>

          <DialogFooter className="mt-6 gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={generatePDF}
              disabled={isGeneratingPDF}
            >
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingPDF ? 'Generating...' : 'Generate PDF'}
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
