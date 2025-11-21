import { useState } from 'react'
import CustomerTable from '@/components/customers/CustomerTable'
import CustomerModal from '@/components/customers/CustomerModal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function Customers() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const handleAdd = () => {
    setSelectedCustomer(null)
    setIsModalOpen(true)
  }

  const handleEdit = (customer) => {
    setSelectedCustomer(customer)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setSelectedCustomer(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your customer database and relationships
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <CustomerTable onEdit={handleEdit} />
      <CustomerModal
        isOpen={isModalOpen}
        onClose={handleClose}
        customer={selectedCustomer}
      />
    </div>
  )
}
