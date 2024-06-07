import { useState, useEffect } from 'react'
import type { RecentTransactions } from '@utils/api'

export default function RecentTransactions () {
  const [dataRT, setDataRT] = useState<RecentTransactions[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/recent-transactions', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }

        const data: RecentTransactions[] = await response.json()
        setDataRT(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])
  return dataRT ? (
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
          <tbody id="table-body">
            {dataRT ? dataRT.map(({ date, category, amount }) => (
              <tr className="bg-gray-200 dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{date}</th>
                <td className="px-4 py-3 text-center">{category}</td>
                <td className="px-4 py-3">${amount}</td>
              </tr>
            )) : null}
          </tbody>
        </table>
      </div>
    </div>
  ): null
}
