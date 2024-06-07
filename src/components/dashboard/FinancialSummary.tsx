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
  return dataFS ? (
    <>
      <div className="bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg p-4">
        <h2 className="text-lg">Balance Total</h2>
        <p id="balance" className="text-2xl font-semibold">${dataFS ? (dataFS.totalEntries - dataFS.totalExits).toFixed(2) : 'No disponible ❌'}</p>
      </div>
      
      <div className="bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg p-4">
        <h2 className="text-lg">Total Ingresos</h2>
        <p id="entries" className="text-2xl font-semibold">${dataFS ? (dataFS.totalEntries).toFixed(2) : 'No disponible ❌'}</p>
      </div>
      
      <div className="bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg p-4">
        <h2 className="text-lg">Total Gastos</h2>
        <p id="exits" className="text-2xl font-semibold">${dataFS ? (dataFS.totalExits).toFixed(2) : 'No disponible ❌'}</p>
      </div>
    </>
  ) : null
}
