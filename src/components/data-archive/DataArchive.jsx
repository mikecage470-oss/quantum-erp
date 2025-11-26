import { useState } from 'react'
import YearView from './YearView'
import MonthView from './MonthView'

export default function DataArchive() {
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(null)

  const handleSelectMonth = (year, month) => {
    setSelectedYear(year)
    setSelectedMonth(month)
  }

  const handleBack = () => {
    setSelectedYear(null)
    setSelectedMonth(null)
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

  return <YearView onSelectMonth={handleSelectMonth} />
}
