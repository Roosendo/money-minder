import { useState, useEffect, useRef } from 'react'
import { createGraphic } from '@utils/create-graph'
import { type MainCategories, fetchMainCategories } from '@utils/api'

export default function MainCategories () {
  const canvasRef = useRef(null)
  const [dataMC, setDataMC] = useState<MainCategories[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMainCategories()
        setDataMC(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (dataMC && canvasRef.current) {
      const ctx = canvasRef.current as HTMLCanvasElement
      const categories = dataMC.map(item => item.category)
      const totalAmounts = dataMC.map(item => item.total)
      const labelsToShow = dataMC.map(item => item.category)
      

      if (ctx && labelsToShow) createGraphic(ctx, categories, totalAmounts, 'Categorías principales')
    }
  }, [dataMC])

  return dataMC ? (
    <div className="bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg p-4 col-span-1 md:col-span-2 lg:col-span-3">
      <h2 className="text-lg font-semibold">Categorías Principales</h2>
      <canvas ref={canvasRef} id="topCategoriesChart" className="max-h-96"></canvas>
    </div>
  ): null
}
