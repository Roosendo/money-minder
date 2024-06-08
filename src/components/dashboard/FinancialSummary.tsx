import { useState, useEffect } from 'react'
import type { FinancialSummary } from '@utils/api'

export default function FinancialSummary () {
  const [dataFS, setDataFS] = useState<FinancialSummary | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/financial-summary', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }

        const data: FinancialSummary = await response.json()
        setDataFS(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  if (!dataFS || (dataFS.totalEntries === null && dataFS.totalExits === null)) return null

  const totalEntries = dataFS.totalEntries !== null ? dataFS.totalEntries : 0
  const totalExits = dataFS.totalExits !== null ? dataFS.totalExits : 0
  const balance = (totalEntries - totalExits).toFixed(2)

  return dataFS ? (
    <>
      <div className="bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg p-4">
        <h2 className="text-lg">Balance Total</h2>
        <p id="balance" className="text-2xl font-semibold">${balance}</p>
      </div>
      
      <div className="bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg p-4">
        <h2 className="text-lg">Total Ingresos</h2>
        <p id="entries" className="text-2xl font-semibold">${totalEntries}</p>
      </div>
      
      <div className="bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg p-4">
        <h2 className="text-lg">Total Gastos</h2>
        <p id="exits" className="text-2xl font-semibold">${totalExits}</p>
      </div>
    </>
  ) : null
}
