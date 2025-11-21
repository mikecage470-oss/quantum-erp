import { useState } from 'react'
import InvoiceTable from '@/components/invoices/InvoiceTable'
import CreateInvoice from '@/components/invoices/CreateInvoice'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function Invoices() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const handleAdd = () => {
    setSelectedInvoice(null)
    setIsModalOpen(true)
  }

  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setSelectedInvoice(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create and manage customer invoices
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <InvoiceTable onEdit={handleEdit} />
      <CreateInvoice
        isOpen={isModalOpen}
        onClose={handleClose}
        invoice={selectedInvoice}
      />
    </div>
  )
}
