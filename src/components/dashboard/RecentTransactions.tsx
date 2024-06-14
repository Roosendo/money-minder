import LoadingSpinner from '@components/LoadingSpinner.tsx'
import { useFetchData } from '@hooks/useFetchData'
import type { RecentTransactions } from '@src/types.d.ts'

function RecentTransactions () {
  const { data: dataRT, error } = useFetchData<RecentTransactions[]>('/api/dashboard/recent-transactions')

  if (error) return null
  if (!dataRT) return <LoadingSpinner />

  return dataRT && (
    <div className="bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg p-4 col-span-1 md:col-span-2">
      <h2 className="text-lg font-semibold">Transacciones Recientes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2">Fecha</th>
              <th className="py-2">Categoría</th>
              <th className="py-2">Monto</th>
            </tr>
          </thead>
          <tbody>
            {dataRT.map(({ date, category, amount }, index) => (
              <tr key={index} className="bg-gray-200 dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{date}</th>
                <td className="px-4 py-3 text-center">{category}</td>
                <td className="px-4 py-3">${amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentTransactions
