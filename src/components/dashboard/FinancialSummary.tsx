import { useFetchData } from '@hooks/useFetchData'
import type { FinancialSummary } from '@src/types.d.ts'

export default function FinancialSummary () {
  const { data: dataFS, error, loading } = useFetchData<FinancialSummary>('/api/dashboard/financial-summary')

  if (loading) return <p>Cargando...</p>
  if (error) return null
  if (!dataFS || (dataFS.totalEntries === null && dataFS.totalExits === null)) return null

  const totalEntries = dataFS.totalEntries !== null ? dataFS.totalEntries : 0
  const totalExits = dataFS.totalExits !== null ? dataFS.totalExits : 0
  const balance = (totalEntries - totalExits).toFixed(2)

  return (
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
  )
}
