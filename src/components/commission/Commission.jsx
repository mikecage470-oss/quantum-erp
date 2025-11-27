import { useState } from 'react'
import CommissionYearView from './CommissionYearView'
import CommissionMonthView from './CommissionMonthView'
import CommissionAllRecords from './CommissionAllRecords'

export default function Commission() {
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [viewAllCommissions, setViewAllCommissions] = useState(false)

  const handleSelectMonth = (year, month) => {
    setSelectedYear(year)
    setSelectedMonth(month)
    setViewAllCommissions(false)
  }

  const handleViewAllCommissions = (year) => {
    setSelectedYear(year)
    setSelectedMonth(null)
    setViewAllCommissions(true)
  }

  const handleBack = () => {
    setSelectedYear(null)
    setSelectedMonth(null)
    setViewAllCommissions(false)
  }

  if (selectedYear && viewAllCommissions) {
    return (
      <CommissionAllRecords
        year={selectedYear}
        onBack={handleBack}
      />
    )
  }

  if (selectedYear && selectedMonth) {
    return (
      <CommissionMonthView
        year={selectedYear}
        month={selectedMonth}
        onBack={handleBack}
      />
    )
  }

  return <CommissionYearView onSelectMonth={handleSelectMonth} onViewAllCommissions={handleViewAllCommissions} />
}
