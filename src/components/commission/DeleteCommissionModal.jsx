import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function DeleteCommissionModal({ isOpen, onClose, onConfirm, commissionInfo }) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle>Delete Commission Record</DialogTitle>
          </div>
          <DialogDescription className="pt-4">
            Are you sure you want to delete this commission record? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {commissionInfo && (
          <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Commission ID:</span>
              <span className="font-medium">{commissionInfo.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">QMS ID:</span>
              <span className="font-medium">{commissionInfo.qmsId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span className="font-medium">{commissionInfo.customer}</span>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
