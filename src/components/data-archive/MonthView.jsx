import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDate } from '@/lib/utils'
import { MONTH_NAMES } from '@/config/constants'
import useDataArchiveStore from '@/stores/dataArchiveStore'
import { ArrowLeft, Calendar, ChevronUp, ChevronDown, DollarSign, TrendingUp, Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const calculateProfit = (order) => (order.poAmount || 0) - (order.vendorAmount || 0)

export default function MonthView({ year, month, onBack }) {
  const { getOrdersByMonth, getMonthSummary } = useDataArchiveStore()
  const orders = useMemo(() => getOrdersByMonth(year, month), [year, month])
  const summary = useMemo(() => getMonthSummary(year, month), [year, month])
  
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const columns = useMemo(
    () => [
      {
        accessorKey: 'qmsId',
        header: 'QMS ID',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      },
      {
        accessorKey: 'customer',
        header: 'Customer',
      },
      {
        accessorKey: 'vendorName',
        header: 'Vendor',
      },
      {
        accessorKey: 'poAmount',
        header: 'Customer PO Amount',
        cell: (info) => formatCurrency(info.getValue()),
      },
      {
        accessorKey: 'vendorAmount',
        header: 'Vendor Amount',
        cell: (info) => formatCurrency(info.getValue()),
      },
      {
        id: 'profit',
        header: 'Profit',
        cell: (info) => {
          const order = info.row.original
          const profit = calculateProfit(order)
          return (
            <span className={profit >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
              {formatCurrency(profit)}
            </span>
          )
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
      {
        accessorKey: 'archiveDate',
        header: 'Archive Date',
        cell: (info) => formatDate(info.getValue()),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const order = info.row.original
          return (
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
          )
        },
      },
    ],
    []
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

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Back button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Years
        </Button>
        <nav className="text-sm text-gray-600">
          <span>Data Archive</span>
          <span className="mx-2">/</span>
          <span>{year}</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-900">{MONTH_NAMES[month - 1]}</span>
        </nav>
      </div>

      {/* Month Summary Card */}
      <Card>
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            {MONTH_NAMES[month - 1]} {year}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Customer PO Amount</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(summary.totalCustomerPOAmount)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Vendor Amount</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(summary.totalVendorAmount)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <TrendingUp className={`h-8 w-8 ${summary.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className="text-sm text-gray-600">Gross Profit</p>
                <p className={`text-lg font-semibold ${summary.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(summary.grossProfit)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Archived Orders ({summary.orderCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
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

      {/* Order Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderId}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-500">QMS ID</p>
                <p>{selectedOrder.qmsId}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Order ID</p>
                <p>{selectedOrder.orderId}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Customer</p>
                <p>{selectedOrder.customer}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Customer PO</p>
                <p>{selectedOrder.customerPO}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Vendor</p>
                <p>{selectedOrder.vendorName}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Status</p>
                <p>{selectedOrder.status}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Customer PO Amount</p>
                <p>{formatCurrency(selectedOrder.poAmount)}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Vendor Amount</p>
                <p>{formatCurrency(selectedOrder.vendorAmount)}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Profit</p>
                <p className={calculateProfit(selectedOrder) >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(calculateProfit(selectedOrder))}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Archive Date</p>
                <p>{formatDate(selectedOrder.archiveDate)}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-gray-500">Item Description</p>
                <p>{selectedOrder.itemDescription}</p>
              </div>
              {selectedOrder.joeNotes && (
                <div className="col-span-2">
                  <p className="font-medium text-gray-500">Joe&apos;s Notes</p>
                  <p>{selectedOrder.joeNotes}</p>
                </div>
              )}
              {selectedOrder.jackNotes && (
                <div className="col-span-2">
                  <p className="font-medium text-gray-500">Jack&apos;s Notes</p>
                  <p>{selectedOrder.jackNotes}</p>
                </div>
              )}
              {selectedOrder.adminNotes && (
                <div className="col-span-2">
                  <p className="font-medium text-gray-500">Admin Notes</p>
                  <p>{selectedOrder.adminNotes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
