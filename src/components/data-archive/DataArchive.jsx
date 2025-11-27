import { useState } from 'react'
import YearView from './YearView'
import MonthView from './MonthView'
import AllYearOrders from './AllYearOrders'

export default function DataArchive() {
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [viewAllOrders, setViewAllOrders] = useState(false)

  const handleSelectMonth = (year, month) => {
    setSelectedYear(year)
    setSelectedMonth(month)
    setViewAllOrders(false)
  }

  const handleViewAllOrders = (year) => {
    setSelectedYear(year)
    setSelectedMonth(null)
    setViewAllOrders(true)
  }

  const handleBack = () => {
    setSelectedYear(null)
    setSelectedMonth(null)
    setViewAllOrders(false)
  }

  if (selectedYear && viewAllOrders) {
    return (
      <AllYearOrders
        year={selectedYear}
        onBack={handleBack}
      />
    )
  }

  if (selectedYear && selectedMonth) {
    return (
      <MonthView
        year={selectedYear}
        month={selectedMonth}
        onBack={handleBack}
      />
    )
  }

  return <YearView onSelectMonth={handleSelectMonth} onViewAllOrders={handleViewAllOrders} />
}

