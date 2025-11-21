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
import useOrderTrackingStore from '@/stores/orderTrackingStore'
import { Download, Search, Eye, ChevronUp, ChevronDown } from 'lucide-react'
import { exportTableToCSV, exportTableToExcel } from '@/lib/exportHelpers'
import { formatCurrency, formatDate } from '@/lib/utils'
import ColumnVisibility from './ColumnVisibility'
import OrderTrackingFilters from './OrderTrackingFilters'
import OrderTrackingDetail from './OrderTrackingDetail'

export default function OrderTrackingTable() {
  const orders = useOrderTrackingStore((state) => state.orders)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnVisibility, setColumnVisibility] = useState({})
  const [sorting, setSorting] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Order ID',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'orderNumber',
        header: 'Order Number',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      },
      {
        accessorKey: 'customerName',
        header: 'Customer',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'product',
        header: 'Product',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue()
          const colorMap = {
            Delivered: 'default',
            Shipped: 'secondary',
            Processing: 'outline',
            Pending: 'outline',
            Cancelled: 'destructive'
          }
          return <Badge variant={colorMap[status] || 'outline'}>{status}</Badge>
        },
      },
      {
        accessorKey: 'orderDate',
        header: 'Order Date',
        cell: (info) => formatDate(info.getValue()),
      },
      {
        accessorKey: 'shipDate',
        header: 'Ship Date',
        cell: (info) => info.getValue() ? formatDate(info.getValue()) : 'N/A',
      },
      {
        accessorKey: 'deliveryDate',
        header: 'Delivery Date',
        cell: (info) => info.getValue() ? formatDate(info.getValue()) : 'N/A',
      },
      {
        accessorKey: 'carrier',
        header: 'Carrier',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'trackingNumber',
        header: 'Tracking Number',
        cell: (info) => info.getValue() || 'N/A',
      },
      {
        accessorKey: 'origin',
        header: 'Origin',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'destination',
        header: 'Destination',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'weight',
        header: 'Weight (lbs)',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'cost',
        header: 'Cost',
        cell: (info) => formatCurrency(info.getValue()),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedOrder(row.original)
              setIsDetailOpen(true)
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: orders,
    columns,
    state: {
      globalFilter,
      columnVisibility,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <ColumnVisibility table={table} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportTableToCSV(table, 'order-tracking.csv')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportTableToExcel(table, 'order-tracking.xlsx', 'Orders')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </div>
            </div>

            <OrderTrackingFilters table={table} />

            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <div className="flex items-center gap-2">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getIsSorted() && (
                                <span>
                                  {header.column.getIsSorted() === 'asc' ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </span>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{' '}
                of {table.getFilteredRowModel().rows.length} orders
              </div>
              <div className="flex gap-2">
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
          </div>
        </CardContent>
      </Card>

      <OrderTrackingDetail
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedOrder(null)
        }}
      />
    </>
  )
}
