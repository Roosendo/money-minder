import { useEffect, useRef, Suspense } from 'react'
import { createGraphicBar } from '@utils/create-graph'
import { useFetchData } from '@hooks/useFetchData'
import type { CashFLow } from '@src/types.d.ts'
import LoadingSpinner from '@components/LoadingSpinner.tsx'

const months: Record<string, string> = {
  '01': 'Enero',
  '02': 'Febrero',
  '03': 'Marzo',
  '04': 'Abril',
  '05': 'Mayo',
  '06': 'Junio',
  '07': 'Julio',
  '08': 'Agosto',
  '09': 'Septiembre',
  '10': 'Octubre',
  '11': 'Noviembre',
  '12': 'Diciembre'
}

const year = new Date().getFullYear()

const CashFlow = (
  { email }: { email: string | undefined | null }
) => {
  const { data: dataCF, error } = useFetchData<CashFLow[]>(`/api/specials/cash-flow?email=${email}&year=${year}`)
  const canvasRef = useRef(null)

  if (error) return null

  useEffect(() => {
    if (dataCF && canvasRef.current) {
      const ctx = canvasRef.current as HTMLCanvasElement
      const ingresosMensuales = dataCF.map((item) => item.total_ingresos)
      const egresosMensuales = dataCF.map((item) => item.total_egresos)
      const saldoNetoMensual = ingresosMensuales.map(
        (ingreso, index) => ingreso - (egresosMensuales[index] || 0)
      )
      const labelsToShow = dataCF.map((item) => months[item.month] || item.month)

      if (ctx && labelsToShow) {
        createGraphicBar(ctx, labelsToShow, ingresosMensuales, egresosMensuales, saldoNetoMensual)
      }
    }
  }, [dataCF])

  if (dataCF && dataCF.length === 0) return null

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className='col-span-1 rounded-lg bg-gray-200 p-4 shadow-lg dark:bg-gray-900 md:col-span-2 lg:col-span-3'>
        <h2 className='text-lg font-semibold'>Flujo de Efectivo</h2>
        <canvas ref={canvasRef}></canvas>
      </div>
    </Suspense>
  )
}

export default CashFlow
