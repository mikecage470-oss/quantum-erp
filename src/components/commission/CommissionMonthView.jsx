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
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { MONTH_NAMES } from '@/config/constants'
import useCommissionStore, { COMMISSION_PAYMENT_STATUS, COMMISSION_STATUS } from '@/stores/commissionStore'
import { ArrowLeft, Calendar, ChevronUp, ChevronDown, DollarSign, TrendingUp, Eye, Pencil, Trash2 } from 'lucide-react'
import ViewCommission from './ViewCommission'
import EditCommission from './EditCommission'
import DeleteCommissionModal from './DeleteCommissionModal'

export default function CommissionMonthView({ year, month, onBack }) {
  const { getCommissionsByMonth, getMonthSummary, deleteCommission, commissions } = useCommissionStore()
  const records = useMemo(() => getCommissionsByMonth(year, month), [year, month, commissions])
  const summary = useMemo(() => getMonthSummary(year, month), [year, month, commissions])
  
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [selectedCommission, setSelectedCommission] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)

  const handleViewCommission = (commission) => {
    setSelectedCommission(commission)
    setIsDetailOpen(true)
  }

  const handleEditCommission = (commission) => {
    setSelectedCommission(commission)
    setIsEditOpen(true)
  }

  const handleDeleteCommission = (commission) => {
    setSelectedCommission(commission)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedCommission) {
      deleteCommission(selectedCommission.id)
      setDeleteSuccess(true)
      setTimeout(() => setDeleteSuccess(false), 3000)
    }
  }

  const getStatusBadge = (status) => {
    const statusOption = COMMISSION_STATUS.find(s => s.value === status)
    if (!statusOption) return <Badge variant="outline">{status}</Badge>
    return <Badge className={`${statusOption.color} text-white`}>{statusOption.label}</Badge>
  }

  const getPaymentStatusBadge = (status) => {
    const statusOption = COMMISSION_PAYMENT_STATUS.find(s => s.value === status)
    if (!statusOption) return <Badge variant="outline">{status}</Badge>
    return <Badge className={`${statusOption.color} text-white`}>{statusOption.label}</Badge>
  }

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
        accessorKey: 'poAmount',
        header: 'PO Amount',
        cell: (info) => formatCurrency(info.getValue()),
      },
      {
        accessorKey: 'actualProfit',
        header: 'Actual Profit',
        cell: (info) => {
          const value = info.getValue()
          return (
            <span className={value >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
              {formatCurrency(value)}
            </span>
          )
        },
      },
      {
        accessorKey: 'commissionAmount',
        header: 'Commission',
        cell: (info) => formatCurrency(info.getValue()),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => getStatusBadge(info.getValue()),
      },
      {
        accessorKey: 'paymentMade',
        header: 'Payment',
        cell: (info) => getPaymentStatusBadge(info.getValue()),
      },
      {
        accessorKey: 'submissionDate',
        header: 'Submission Date',
        cell: (info) => formatDate(info.getValue()),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const commission = info.row.original
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewCommission(commission)}
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditCommission(commission)}
                title="Edit Commission"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteCommission(commission)}
                title="Delete Commission"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: records,
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
          <span>Commission</span>
          <span className="mx-2">/</span>
          <span>{year}</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-900">{MONTH_NAMES[month - 1]}</span>
        </nav>
      </div>

      {/* Delete Success Message */}
      {deleteSuccess && (
        <div className="p-3 rounded-md text-sm bg-green-50 text-green-700 border border-green-200">
          Commission record deleted successfully!
        </div>
      )}

      {/* Month Summary Card */}
      <Card>
        <CardHeader className="bg-purple-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
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
              <TrendingUp className={`h-8 w-8 ${summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className={`text-lg font-semibold ${summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(summary.netProfit)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commission Table */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Records ({summary.commissionCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Search commission records..."
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
                        No commission records found
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
              of {table.getFilteredRowModel().rows.length} records
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

      {/* View Commission Modal */}
      <ViewCommission
        commission={selectedCommission}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedCommission(null)
        }}
      />

      {/* Edit Commission Modal */}
      <EditCommission
        commission={selectedCommission}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false)
          setSelectedCommission(null)
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCommissionModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setSelectedCommission(null)
        }}
        onConfirm={handleConfirmDelete}
        commissionInfo={selectedCommission}
      />
    </div>
  )
}
