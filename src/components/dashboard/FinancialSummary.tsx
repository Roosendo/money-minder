import { Suspense } from 'react'
import LoadingSpinner from '@components/LoadingSpinner.tsx'
import { useFetchData } from '@hooks/useFetchData'
import type { FinancialSummary as FinancialSummaryType } from '@src/types.d.ts'

const year = new Date().getFullYear()

const FinancialSummary = ({ email }: { email: string | undefined | null }) => {
  const { data: dataFS, error } = useFetchData<FinancialSummaryType>(
    `/api/specials/financial-summary-yearly?email=${email}&year=${year}`
  )

  if (error) return null
  if (!dataFS || (!dataFS.totalEntries && !dataFS.totalExits)) return null

  const totalEntries = dataFS.totalEntries !== null ? dataFS.totalEntries : 0
  const totalExits = dataFS.totalExits !== null ? dataFS.totalExits : 0
  const balance = (totalEntries - totalExits).toFixed(2)

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className='rounded-lg bg-gray-200 p-4 shadow-lg dark:bg-gray-900'>
        <h2 className='text-lg'>Balance Total</h2>
        <p id='balance' className='text-2xl font-semibold'>
          ${balance}
        </p>
      </div>

      <div className='rounded-lg bg-gray-200 p-4 shadow-lg dark:bg-gray-900'>
        <h2 className='text-lg'>Total Ingresos</h2>
        <p id='entries' className='text-2xl font-semibold'>
          ${totalEntries}
        </p>
      </div>

      <div className='rounded-lg bg-gray-200 p-4 shadow-lg dark:bg-gray-900'>
        <h2 className='text-lg'>Total Gastos</h2>
        <p id='exits' className='text-2xl font-semibold'>
          ${totalExits}
        </p>
      </div>
    </Suspense>
  )
}

export default FinancialSummary
