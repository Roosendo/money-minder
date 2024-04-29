import type { UserData, Sale, Income } from '../types'

/**
 * Determines if the user is logged in.
 * @param userData - The user data.
 * @returns A boolean indicating if the user is logged in.
 */
export const isUserLoggedIn = (userData: UserData | null): boolean => userData !== null && userData.IsLoggedIn

/**
 * Retrieves the sales data from the user data.
 * @param userData - The user data.
 * @returns An array of sales data.
 */
export const getSales = (userData: UserData | null): Sale[] => userData?.Sales ?? []

/**
 * Adds sales data to the user data.
 * @param userData - The user data.
 * @param sale - The sales data to be added.
 * @returns The updated user data.
 */
export const addSale = (userData: UserData, sale: Sale[]): UserData => {
  const updatedSales = { ...userData, Sales: [...(userData?.Sales ?? []), ...sale] }
  return updatedSales
}

/**
 * Retrieves the income data from the user data.
 * @param userData - The user data.
 * @returns An array of income data.
 */
export const getIncomes = (userData: UserData | null): Income[] => userData?.Incomes ?? []

/**
 * Adds income data to the user data.
 * @param userData - The user data.
 * @param income - The income data to be added.
 * @returns The updated user data.
 */
export const addIncome = (userData: UserData, income: Income[]): UserData => {
  const updatedIncomes = { ...userData, Incomes: [...(userData?.Incomes ?? []), ...income] }
  return updatedIncomes
}

/**
 * Retrieves the monthly limit from the user data.
 * @param userData - The user data.
 * @returns The monthly limit value.
 */
export const getMonthlyLimit = (userData: UserData | null): number | undefined => userData?.MonthlyLimit

/**
 * Sets the monthly limit in the user data.
 * @param userData - The user data.
 * @param monthlyLimit - The monthly limit value to be set.
 * @returns The updated user data.
 */
export const setMonthlyLimit = (userData: UserData, monthlyLimit: number): UserData => {
  const updatedMonthlyLimit = { ...userData, MonthlyLimit: monthlyLimit }
  return updatedMonthlyLimit
}
