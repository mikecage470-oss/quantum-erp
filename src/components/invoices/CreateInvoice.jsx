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
import useInvoiceStore from '@/stores/invoiceStore'
import useCustomerStore from '@/stores/customerStore'
import useOrderTrackingStore from '@/stores/orderTrackingStore'
import { Plus, Trash2, Download, Upload, X } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const DEFAULT_COMPANY_TEXT = 'Quantum Concierge Services LLC'
const DEFAULT_VENDOR_ADDRESS = `Quantum Concierge Services LLC
208 Somersly PL,
Lexington KY, 40515`
const DEFAULT_BANK_DETAILS = `Bank Details for Direct Deposit

Account Name: Quantum Concierge Services LLC
Bank Name: Community Trust Bank
Bank Address: 3090 Richmond Road, Lexington, KY 40509
Account Number: 4004992295
ABA/Routing Number: 042102694`
const DEFAULT_TERMS_AND_CONDITIONS = `Any discrepancies must be reported within 7 days of invoice receipt. Payments made after 30 days will incur a 2% interest fee. Our bank account details remain unchanged; payments to any other account are at the payer's risk. No warranties are provided; all warranties are with the respective manufacturer. Once handed over to the freight forwarder, Quantum Concierge Services LLC is not liable for any loss or damage. Goods are non-returnable, and RMAs require prior approval. Order cancellations may incur charges.`

export default function CreateInvoice({ isOpen, onClose, invoice }) {
  const addInvoice = useInvoiceStore((state) => state.addInvoice)
  const updateInvoice = useInvoiceStore((state) => state.updateInvoice)
  const customers = useCustomerStore((state) => state.customers)
  const orders = useOrderTrackingStore((state) => state.orders)
  const updateOrder = useOrderTrackingStore((state) => state.updateOrder)
  const fileInputRef = useRef(null)

  const getInitialFormData = () => ({
    // Section A: Company/Vendor Information
    companyText: DEFAULT_COMPANY_TEXT,
    vendorAddress: DEFAULT_VENDOR_ADDRESS,
    // Section B: Invoice Details
    customerId: '',
    customerName: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    qmsId: '',
    qmsInvoice: '',
    shipToAddress: '',
    paymentTerms: '',
    shippingMethod: '',
    deliveryDate: '',
    // Section C: Items
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    // Section D: Financial
    subtotal: 0,
    taxRate: 0,
    discount: 0,
    shipping: 0,
    total: 0,
    // Section E: Bank Details
    bankDetails: DEFAULT_BANK_DETAILS,
    // Section F: Terms and Conditions
    termsAndConditions: DEFAULT_TERMS_AND_CONDITIONS,
    // Section G: Logo
    companyLogo: '',
    // Additional fields
    notes: '',
    status: 'Draft'
  })

  const [formData, setFormData] = useState(getInitialFormData())
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)

  useEffect(() => {
    if (invoice) {
      setFormData({
        ...getInitialFormData(),
        ...invoice,
        companyText: invoice.companyText || DEFAULT_COMPANY_TEXT,
        vendorAddress: invoice.vendorAddress || DEFAULT_VENDOR_ADDRESS,
        bankDetails: invoice.bankDetails || DEFAULT_BANK_DETAILS,
        termsAndConditions: invoice.termsAndConditions || DEFAULT_TERMS_AND_CONDITIONS,
        taxRate: invoice.taxRate || 0,
        discount: invoice.discount || 0,
        shipping: invoice.shipping || 0
      })
      if (invoice.companyLogo) {
        setLogoPreview(invoice.companyLogo)
      }
    } else {
      setFormData(getInitialFormData())
      setLogoPreview(null)
    }
  }, [invoice, isOpen])

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

  const handleCustomerChange = (customerId) => {
    const customer = customers.find((c) => c.id === customerId)
    setFormData((prev) => ({
      ...prev,
      customerId,
      customerName: customer ? customer.customer : ''
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
    if (!formData.customerName) {
      alert('Please select a customer.')
      return
    }
    if (!formData.deliveryDate) {
      alert('Please enter a delivery date.')
      return
    }
    if (formData.items.length === 0 || !formData.items[0].description) {
      alert('Please add at least one item.')
      return
    }

    // Update or add Invoice
    if (invoice) {
      updateInvoice(invoice.id, formData)
    } else {
      addInvoice(formData)
    }

    // Integration with Order Tracking - Update qmsInvoice field
    if (formData.qmsId && formData.qmsInvoice) {
      const matchingOrder = orders.find((order) => order.qmsId === formData.qmsId)
      if (matchingOrder) {
        updateOrder(matchingOrder.id, { qmsInvoice: formData.qmsInvoice })
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

      // Company text (under logo area)
      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text(formData.companyText, pageWidth - 15, yPos, { align: 'right' })

      yPos += 30

      // INVOICE title
      doc.setFontSize(22)
      doc.setTextColor(0)
      doc.setFont(undefined, 'bold')
      doc.text('INVOICE', pageWidth / 2, yPos, { align: 'center' })

      yPos += 15

      // Invoice Number and Date
      doc.setFontSize(11)
      doc.setFont(undefined, 'normal')
      doc.text(`Invoice Number: ${invoice?.id || 'NEW'}`, pageWidth - 15, yPos, { align: 'right' })
      doc.text(`Date: ${formData.invoiceDate}`, pageWidth - 15, yPos + 6, { align: 'right' })
      if (formData.qmsInvoice) {
        doc.text(`QMS Invoice: ${formData.qmsInvoice}`, pageWidth - 15, yPos + 12, { align: 'right' })
      }

      yPos += 25

      // Vendor Section
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('From:', 15, yPos)
      doc.setFont(undefined, 'normal')
      doc.setFontSize(10)
      const vendorAddressLines = doc.splitTextToSize(formData.vendorAddress, 80)
      doc.text(vendorAddressLines, 15, yPos + 6)

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

      // Invoice Details Section
      doc.setFontSize(10)
      doc.setFont(undefined, 'bold')
      doc.text('Customer:', 15, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(formData.customerName, 55, yPos)

      doc.setFont(undefined, 'bold')
      doc.text('Payment Terms:', 110, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(formData.paymentTerms, 150, yPos)

      yPos += 7
      doc.setFont(undefined, 'bold')
      doc.text('Shipping Method:', 15, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(formData.shippingMethod, 55, yPos)

      doc.setFont(undefined, 'bold')
      doc.text('Delivery Date:', 110, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(formData.deliveryDate, 150, yPos)

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

      // Bank Details Section (left side, below financial summary)
      yPos += 15
      doc.setFontSize(8)
      doc.setFont(undefined, 'bold')
      doc.text('Bank Details:', 15, yPos)
      doc.setFont(undefined, 'normal')
      doc.setFontSize(7)
      yPos += 5
      const bankLines = doc.splitTextToSize(formData.bankDetails, 80)
      doc.text(bankLines, 15, yPos)

      // Terms and Conditions (centered, smaller font)
      yPos += bankLines.length * 3 + 15
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(8)
      doc.setFont(undefined, 'bold')
      doc.text('Terms and Conditions:', pageWidth / 2, yPos, { align: 'center' })
      doc.setFont(undefined, 'normal')
      doc.setFontSize(7)
      yPos += 6
      const termsLines = doc.splitTextToSize(formData.termsAndConditions, pageWidth - 30)
      doc.text(termsLines, pageWidth / 2, yPos, { align: 'center' })

      // Generate filename and save
      const filename = `INV-${invoice?.id || 'NEW'}-${formData.invoiceDate}.pdf`
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
          <DialogTitle className="text-xl">{invoice ? 'Edit Invoice' : 'Create Invoice'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
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

            {/* Section A: Company/Vendor Information */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-md font-semibold mb-3 text-gray-700">Company/Vendor Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Text (displayed under logo)</Label>
                  <Input
                    value={formData.companyText}
                    onChange={(e) => setFormData((prev) => ({ ...prev, companyText: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vendor Address</Label>
                  <Textarea
                    value={formData.vendorAddress}
                    onChange={(e) => setFormData((prev) => ({ ...prev, vendorAddress: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Section B: Invoice Details */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="text-md font-semibold mb-3 text-blue-700">Invoice Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Customer *</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={handleCustomerChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.customer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Invoice Date</Label>
                  <Input
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, invoiceDate: e.target.value }))}
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
                <div className="space-y-2">
                  <Label>QMS ID</Label>
                  <Input
                    value={formData.qmsId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, qmsId: e.target.value }))}
                    placeholder="e.g., QMS-0001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>QMS Invoice</Label>
                  <Input
                    value={formData.qmsInvoice}
                    onChange={(e) => setFormData((prev) => ({ ...prev, qmsInvoice: e.target.value }))}
                    placeholder="e.g., QMS-INV-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <Input
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData((prev) => ({ ...prev, paymentTerms: e.target.value }))}
                    placeholder="Enter payment terms"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Shipping Method</Label>
                  <Input
                    value={formData.shippingMethod}
                    onChange={(e) => setFormData((prev) => ({ ...prev, shippingMethod: e.target.value }))}
                    placeholder="Enter shipping method"
                  />
                </div>
                <div className="col-span-2 space-y-2">
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

            {/* Section C: Items */}
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

            {/* Section D: Financial Calculations */}
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

            {/* Section E: Bank Account Details */}
            <div className="border rounded-lg p-4 bg-green-50">
              <h3 className="text-md font-semibold mb-3 text-green-700">Bank Account Details</h3>
              <Textarea
                value={formData.bankDetails}
                onChange={(e) => setFormData((prev) => ({ ...prev, bankDetails: e.target.value }))}
                rows={6}
                className="text-sm"
              />
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

            {/* Notes (optional) */}
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
              {invoice ? 'Update' : 'Create'} Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
