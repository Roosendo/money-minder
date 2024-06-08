import { useState, useEffect, useRef } from 'react'
import { createGraphicBar } from '@utils/create-graph'
import { type CashFLow, fetchCashFlow } from '@utils/api'

export default function CashFlow () {
  const canvasRef = useRef(null)
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

  const [dataCF, setDataCF] = useState<CashFLow[] | null>(null)
  const [hasData, setHasData] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCashFlow()
        setDataCF(data)
      } catch (error) {
        if (error instanceof Response && error.status === 404) {
          setHasData(false)
        } else {
          console.error('Error fetching data:', error)
        }
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (dataCF && canvasRef.current) {
      const ctx = canvasRef.current as HTMLCanvasElement
      const ingresosMensuales = dataCF.map(item => item.total_ingresos)
      const egresosMensuales = dataCF.map(item => item.total_egresos)
      const saldoNetoMensual = ingresosMensuales.map((ingreso, index) => ingreso - (egresosMensuales[index] || 0))
      const labelsToShow = dataCF.map(item => months[item.month] || item.month)

      if (ctx && labelsToShow) createGraphicBar(ctx, labelsToShow, ingresosMensuales, egresosMensuales, saldoNetoMensual)
    }
  }, [dataCF])

  if (!hasData) return null

  return dataCF ? (
    <div className="bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg p-4 col-span-1 md:col-span-2 lg:col-span-3">
      <h2 className="text-lg font-semibold">Flujo de Efectivo</h2>
      <canvas ref={canvasRef} id="cashFlowChart"></canvas>
    </div>
  ) : null
}
