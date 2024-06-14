import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch data')
  return res.json()
})

export const useFetchData = <T>(url: string) => {
  const { data, error } = useSWR<T>(url, fetcher)

  return { data, error }
}
