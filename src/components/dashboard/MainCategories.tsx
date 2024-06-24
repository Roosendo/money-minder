import { useEffect, useRef, Suspense } from 'react'
import LoadingSpinner from '@components/LoadingSpinner.tsx'
import { useFetchData } from '@hooks/useFetchData'
import { createGraphic } from '@utils/create-graph'
import type { MainCategories as MainCategoriesType } from '@src/types.d.ts'
import { $ } from '@src/lib/dom-selector'

const email = $<HTMLParagraphElement>('#user-email')?.textContent?.trim()
const year = new Date().getFullYear()

const MainCategories = () => {
  const { data: dataMC, error } = useFetchData<MainCategoriesType[]>(
    `/api/specials/yearly-categories?email=${email}&year=${year}`
  )
  const canvasRef = useRef(null)

  if (error) return null

  useEffect(() => {
    if (dataMC && canvasRef.current) {
      const ctx = canvasRef.current as HTMLCanvasElement
      const categories = dataMC.map((item) => item.category)
      const totalAmounts = dataMC.map((item) => item.total)
      const labelsToShow = dataMC.map((item) => item.category)

      if (ctx && labelsToShow) {
        createGraphic(ctx, categories, totalAmounts, 'Categorías principales')
      }
    }
  }, [dataMC])

  return (
    dataMC && (
      <Suspense fallback={<LoadingSpinner />}>
        <div className='col-span-1 rounded-lg bg-gray-200 p-4 shadow-lg dark:bg-gray-900 md:col-span-2 lg:col-span-3'>
          <h2 className='text-lg font-semibold'>Categorías Principales</h2>
          <canvas ref={canvasRef} className='max-h-96'></canvas>
        </div>
      </Suspense>
    )
  )
}

export default MainCategories
