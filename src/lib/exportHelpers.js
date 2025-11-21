import * as XLSX from 'xlsx'

export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escape quotes and wrap in quotes if contains comma or quote
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToExcel = (data, filename = 'export.xlsx', sheetName = 'Sheet1') => {
  if (!data || data.length === 0) return

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  
  XLSX.writeFile(workbook, filename)
}

export const exportTableToCSV = (table, filename = 'export.csv') => {
  const rows = table.getFilteredRowModel().rows
  const data = rows.map(row => {
    const obj = {}
    table.getAllColumns().forEach(column => {
      if (column.getIsVisible()) {
        obj[column.id] = row.getValue(column.id)
      }
    })
    return obj
  })
  exportToCSV(data, filename)
}

export const exportTableToExcel = (table, filename = 'export.xlsx', sheetName = 'Data') => {
  const rows = table.getFilteredRowModel().rows
  const data = rows.map(row => {
    const obj = {}
    table.getAllColumns().forEach(column => {
      if (column.getIsVisible()) {
        obj[column.id] = row.getValue(column.id)
      }
    })
    return obj
  })
  exportToExcel(data, filename, sheetName)
}
