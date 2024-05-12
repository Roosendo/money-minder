interface Entry {
  date: string;
  amount: number;
  category: string;
  description: string;
}

export const renderTable = (entries: Entry[]): string => {
  let tableHTML = ''

  if (entries.length === 0) {
    return `
      <tr class="bg-white dark:bg-gray-800">
        <td class="px-4 py-3 text-center font-medium text-gray-900 dark:text-white" colspan="4">
          Sin registros
        </td>
      </tr>
    `
  }
  entries.forEach((entry, index) => {
    const isLastRow = index === entries.length - 1
    const rowClass = isLastRow ? '' : 'border-b '
    const rowHTML = `
      <tr class="bg-white ${rowClass}dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
        <th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          $${entry.amount}
        </th>
        <td class="px-4 py-3">
          ${entry.category}
        </td>
        <td class="px-4 py-3">
          ${entry.description}
        </td>
        <td class="px-4 py-3">
          ${entry.date}
        </td>
      </tr>
    `
    tableHTML += rowHTML
  })

  return tableHTML
}
