import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export default function OrderTrackingFilters({ table }) {
  const statusColumn = table.getColumn('status')
  const priorityColumn = table.getColumn('priority')

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Label className="text-sm text-gray-600">Status:</Label>
        <Select
          value={statusColumn?.getFilterValue() ?? 'all'}
          onValueChange={(value) => {
            if (value === 'all') {
              statusColumn?.setFilterValue(undefined)
            } else {
              statusColumn?.setFilterValue(value)
            }
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-sm text-gray-600">Priority:</Label>
        <Select
          value={priorityColumn?.getFilterValue() ?? 'all'}
          onValueChange={(value) => {
            if (value === 'all') {
              priorityColumn?.setFilterValue(undefined)
            } else {
              priorityColumn?.setFilterValue(value)
            }
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="Standard">Standard</SelectItem>
            <SelectItem value="Express">Express</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
