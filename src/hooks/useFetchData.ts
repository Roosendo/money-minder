import useSWR from 'swr'

const dominio = 'https://money-minder-api.vercel.app/'
const fetcher = (url: string) => fetch(dominio + url).then((res) => res.json())

export const useFetchData = <T>(url: string) => {
  const { data, error } = useSWR<T>(url, fetcher)

  return { data, error }
}
