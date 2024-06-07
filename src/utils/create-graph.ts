import { Chart, registerables } from 'chart.js/auto'

export const createGraphic = (
  ctx: HTMLCanvasElement,
  categorias: string[],
  cantidades: number[],
  text: string
) => {
  const chart = Chart.getChart(ctx)
  if (chart) {
    chart.destroy()
  }

  Chart.defaults.font.family = 'Saira Variable'

  const myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categorias,
      datasets: [{
        label: text,
        data: cantidades,
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(201, 203, 207, 0.6)',
          'rgba(233, 30, 99, 0.6)',
          'rgba(0, 250, 154, 0.6)',
          'rgba(255, 87, 34, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(201, 203, 207, 1)',
          'rgba(233, 30, 99, 1)',
          'rgba(0, 250, 154, 1)',
          'rgba(255, 87, 34, 1)'
        ],
        borderWidth: 1,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      animation: {
        animateRotate: true,
        animateScale: true
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        }
      }
    }
  })

  return myChart
}

export const createGraphicBar = (
  ctx: HTMLCanvasElement,
  labelsToShow: string[],
  ingresosMensuales: number[],
  egresosMensuales: number[],
  saldoNetoMensual: number[]
) => {
  const chart = Chart.getChart(ctx)
  if (chart) {
    chart.destroy()
  }
  Chart.register(...registerables)
  Chart.defaults.font.family = 'Saira Variable'

  const myChart = new Chart(ctx, {
    type: 'bar',
      data: {
        labels: labelsToShow,
        datasets: [
          {
            label: 'Ingresos',
            data: ingresosMensuales,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Egresos',
            data: egresosMensuales,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Saldo Neto',
            data: saldoNetoMensual,
            type: 'line',
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Meses'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Monto en $'
            },
            beginAtZero: true
          }
        }
      },
  })

  return myChart
}
