import { renderTable } from '@utils/render-table'

interface Transaction {
  entry_id: number
  user_email: string
  amount: number
  description: string
  category: string
  date: string
}

export const fetchData = async (url: string): Promise<Transaction[]> => {
  if (url !== 'entries' && url !== 'exits') {
    return []
  }
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
  const response = await fetch(`/api/get-${url}`, requestOptions)

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const transaction: Transaction[] = await response.json()

  return transaction
}

export const renderData = async (data: Transaction[], element: HTMLElement) => {
  const tbody = renderTable(data)
  element.innerHTML = ''
  element.innerHTML = tbody
}