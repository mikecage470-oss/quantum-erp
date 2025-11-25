import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useOrderTrackingStore from '@/stores/orderTrackingStore'
import { Eye, Pencil, ChevronUp, ChevronDown } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import OrderTrackingDetailView from './OrderTrackingDetailView'
import OrderTrackingEditModal from './OrderTrackingEditModal'
import { 
  ATTENTION_CATEGORIES, 
  STATUS_OPTIONS, 
  PAYMENT_STATUS_OPTIONS, 
  SUPPLY_CHAIN_STAGES,
  CC_CHARGE_RATE
} from '@/config/constants'

export default function OrderTrackingTable() {
  const { orders, updateOrder } = useOrderTrackingStore()
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  // Helper function to get label from value
  const getLabel = (options, value) => {
    const option = options.find(opt => opt.value === value)
    return option ? option.label : value
  }

  // Helper for inline dropdown editing
  const handleInlineUpdate = (orderId, field, value) => {
    updateOrder(orderId, { [field]: value })
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'orderId',
        header: 'Order ID',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      },
      {
        accessorKey: 'customer',
        header: 'Customer',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'customerPO',
        header: 'Customer PO',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'itemDescription',
        header: 'Item Description',
        cell: (info) => (
          <div className="max-w-xs truncate" title={info.getValue()}>
            {info.getValue()}
          </div>
        ),
      },
      {
        accessorKey: 'attentionCategory',
        header: 'Attention Category',
        cell: (info) => {
          const order = info.row.original
          return (
            <Select 
              value={info.getValue()} 
              onValueChange={(value) => handleInlineUpdate(order.id, 'attentionCategory', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ATTENTION_CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${cat.color}`}></span>
                      {cat.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const order = info.row.original
          return (
            <Select 
              value={info.getValue()} 
              onValueChange={(value) => handleInlineUpdate(order.id, 'status', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(stat => (
                  <SelectItem key={stat.value} value={stat.value}>
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${stat.color}`}></span>
                      {stat.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        },
      },
      {
        accessorKey: 'paymentStatus',
        header: 'Payment Status',
        cell: (info) => {
          const order = info.row.original
          return (
            <Select 
              value={info.getValue()} 
              onValueChange={(value) => handleInlineUpdate(order.id, 'paymentStatus', value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_STATUS_OPTIONS.map(ps => (
                  <SelectItem key={ps.value} value={ps.value}>
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${ps.color}`}></span>
                      {ps.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        },
      },
      {
        accessorKey: 'supplyChainStage',
        header: 'Supply Chain Stage',
        cell: (info) => {
          const order = info.row.original
          return (
            <Select 
              value={info.getValue()} 
              onValueChange={(value) => handleInlineUpdate(order.id, 'supplyChainStage', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPLY_CHAIN_STAGES.map(stage => (
                  <SelectItem key={stage.value} value={stage.value}>
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${stage.color}`}></span>
                      {stage.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        },
      },
      {
        accessorKey: 'poAmount',
        header: 'PO Amount',
        cell: (info) => formatCurrency(info.getValue()),
      },
      {
        id: 'actualProfit',
        header: 'Actual Profit',
        cell: (info) => {
          const order = info.row.original
          const grossProfit = (order.poAmount || 0) - (order.vendorAmount || 0) - (order.specialExpenses || 0)
          const orderCcChargeRate = order.ccChargeRate ?? CC_CHARGE_RATE
          const ccCharge = grossProfit * orderCcChargeRate
          const actualProfit = grossProfit - ccCharge
          return (
            <span className={actualProfit >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
              {formatCurrency(actualProfit)}
            </span>
          )
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const order = info.row.original
          return (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedOrder(order)
                  setIsDetailOpen(true)
                }}
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedOrder(order)
                  setIsEditOpen(true)
                }}
                title="Edit Order"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )
        },
      },
    ],
    [updateOrder]
  )

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  // Calculate total actual profit
  const totalActualProfit = useMemo(() => {
    return orders.reduce((sum, order) => {
      const grossProfit = (order.poAmount || 0) - (order.vendorAmount || 0) - (order.specialExpenses || 0)
      const orderCcChargeRate = order.ccChargeRate ?? CC_CHARGE_RATE
      const ccCharge = grossProfit * orderCcChargeRate
      const actualProfit = grossProfit - ccCharge
      return sum + actualProfit
    }, 0)
  }, [orders])

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          {/* Search Bar */}
          <div className="mb-4">
            <Input
              placeholder="Search orders..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b bg-gray-50">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              className={
                                header.column.getCanSort()
                                  ? 'flex items-center gap-2 cursor-pointer select-none'
                                  : ''
                              }
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getCanSort() && (
                                <span>
                                  {header.column.getIsSorted() === 'asc' ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : header.column.getIsSorted() === 'desc' ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronUp className="h-4 w-4 opacity-0" />
                                  )}
                                </span>
                              )}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-3 text-sm">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t bg-gray-100 font-semibold">
                    <td colSpan={columns.length - 2} className="px-4 py-3 text-right text-sm">
                      Total Actual Profit:
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={totalActualProfit >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {formatCurrency(totalActualProfit)}
                      </span>
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-700">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              of {table.getFilteredRowModel().rows.length} orders
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail View Modal */}
      <OrderTrackingDetailView
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedOrder(null)
        }}
      />

      {/* Edit Modal */}
      <OrderTrackingEditModal
        order={selectedOrder}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false)
          setSelectedOrder(null)
        }}
      />
    </div>
  )
}
