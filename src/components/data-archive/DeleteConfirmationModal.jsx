import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, orderInfo }) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle>Delete Archived Order</DialogTitle>
          </div>
          <DialogDescription className="pt-4">
            Are you sure you want to delete this order? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {orderInfo && (
          <div className="my-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Order ID:</span> {orderInfo.orderId}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">QMS ID:</span> {orderInfo.qmsId}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Customer:</span> {orderInfo.customer}
            </p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
