import { useEffect, useRef } from 'react'
import { useFetchData } from '@hooks/useFetchData'
import { createGraphic } from '@utils/create-graph'
import type { MainCategories } from '@src/types.d.ts'

export default function MainCategories () {
  const { data: dataMC, error, loading } = useFetchData<MainCategories[]>('/api/dashboard/main-categories')
  const canvasRef = useRef(null)

  useEffect(() => {
    if (dataMC && canvasRef.current) {
      const ctx = canvasRef.current as HTMLCanvasElement
      const categories = dataMC.map(item => item.category)
      const totalAmounts = dataMC.map(item => item.total)
      const labelsToShow = dataMC.map(item => item.category)
      

      if (ctx && labelsToShow) createGraphic(ctx, categories, totalAmounts, 'Categorías principales')
    }
  }, [dataMC])

  if (loading) return <p>Cargando...</p>
  if (error) return null

  return (
    <div className="bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg p-4 col-span-1 md:col-span-2 lg:col-span-3">
      <h2 className="text-lg font-semibold">Categorías Principales</h2>
      <canvas ref={canvasRef} id="topCategoriesChart" className="max-h-96"></canvas>
    </div>
  )
}
