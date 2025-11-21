import { useState } from 'react'
import POTable from '@/components/purchase-orders/POTable'
import CreatePO from '@/components/purchase-orders/CreatePO'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function PurchaseOrders() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPO, setSelectedPO] = useState(null)

  const handleAdd = () => {
    setSelectedPO(null)
    setIsModalOpen(true)
  }

  const handleEdit = (po) => {
    setSelectedPO(po)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setSelectedPO(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create and manage purchase orders
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Create PO
        </Button>
      </div>

      <POTable onEdit={handleEdit} />
      <CreatePO
        isOpen={isModalOpen}
        onClose={handleClose}
        po={selectedPO}
      />
    </div>
  )
}
