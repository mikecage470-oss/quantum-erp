import { useState } from 'react'
import VendorTable from '@/components/vendors/VendorTable'
import VendorModal from '@/components/vendors/VendorModal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function Vendors() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)

  const handleAdd = () => {
    setSelectedVendor(null)
    setIsModalOpen(true)
  }

  const handleEdit = (vendor) => {
    setSelectedVendor(vendor)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setSelectedVendor(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your vendor relationships and contacts
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      <VendorTable onEdit={handleEdit} />
      <VendorModal
        isOpen={isModalOpen}
        onClose={handleClose}
        vendor={selectedVendor}
      />
    </div>
  )
}
