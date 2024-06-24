import { Suspense } from 'react'
import LoadingSpinner from '@components/LoadingSpinner.tsx'
import { useFetchData } from '@hooks/useFetchData'
import type { RecentTransactions as RecentTransactionsType } from '@src/types.d.ts'

const year = new Date().getFullYear()

function RecentTransactions (
  { email }: { email: string | undefined | null }
) {
  const { data: dataRT, error } = useFetchData<RecentTransactionsType[]>(
    `/api/specials/recent-transactions?email=${email}&year=${year}`
  )

  if (error) return null
  if (dataRT && dataRT.length === 0) return null

  return dataRT && (
    <Suspense fallback={<LoadingSpinner />}>
      <div className='col-span-1 rounded-lg bg-gray-200 p-4 shadow-lg dark:bg-gray-900 md:col-span-2'>
        <h2 className='text-lg font-semibold'>Transacciones Recientes</h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full'>
            <thead>
              <tr>
                <th className='py-2'>Fecha</th>
                <th className='py-2'>Categoría</th>
                <th className='py-2'>Monto</th>
              </tr>
            </thead>
            <tbody>
              {dataRT.map(({ date, category, amount }, index) => (
                <tr
                  key={index}
                  className='bg-gray-200 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-700'
                >
                  <th
                    scope='row'
                    className='whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-white'
                  >
                    {date}
                  </th>
                  <td className='px-4 py-3 text-center'>{category}</td>
                  <td className='px-4 py-3'>${amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Suspense>
  )
}

export default RecentTransactions
