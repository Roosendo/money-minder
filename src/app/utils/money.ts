import type { Money } from "../models/api.model";

/**
 * Money is exchanged with the API as a decimal string with two decimals
 * (`"1250.00"`). These helpers keep arithmetic in integer cents so the UI
 * never has to use floating point for ledger values.
 */
export const ZERO_MONEY: Money = "0.00";

const toCents = (value: string | number | null | undefined): bigint => {
  if (value === null || value === undefined) return 0n;

  let raw = typeof value === "number" ? value.toString() : value.trim();
  if (!raw) return 0n;

  const negative = raw.startsWith("-");
  if (negative) raw = raw.slice(1);

  const [wholePart = "0", fractionPart = ""] = raw.split(".");
  const whole = /^\d+$/.test(wholePart) ? BigInt(wholePart) : 0n;

  const paddedFraction = `${fractionPart}000`;
  let cents = BigInt(paddedFraction.slice(0, 2));
  if (Number(paddedFraction[2]) >= 5) cents += 1n;

  const total = whole * 100n + cents;
  return negative ? -total : total;
};

const fromCents = (cents: bigint): Money => {
  const negative = cents < 0n;
  const absolute = negative ? -cents : cents;
  const whole = absolute / 100n;
  const fraction = (absolute % 100n).toString().padStart(2, "0");

  return `${negative ? "-" : ""}${whole}.${fraction}`;
};

export const toMoney = (value: string | number | null | undefined): Money =>
  fromCents(toCents(value));

export const addMoney = (...values: Array<string | number | null | undefined>): Money =>
  fromCents(values.reduce<bigint>((sum, value) => sum + toCents(value), 0n));

export const subtractMoney = (
  minuend: string | number | null | undefined,
  subtrahend: string | number | null | undefined,
): Money => fromCents(toCents(minuend) - toCents(subtrahend));

export const isPositiveMoney = (value: string | number | null | undefined): boolean =>
  toCents(value) > 0n;

export const isNegativeMoney = (value: string | number | null | undefined): boolean =>
  toCents(value) < 0n;

/**
 * Converts a money string to a number for display-only consumers such as
 * charts. Never feed the result back into ledger math or writes.
 */
export const moneyToNumber = (value: string | number | null | undefined): number =>
  Number(toMoney(value));

/**
 * A transaction amount must be greater than zero and have at most two decimals.
 */
export const isValidPositiveMoney = (value: string | number | null | undefined): boolean => {
  const raw = typeof value === "number" ? value.toString() : (value ?? "").trim();
  if (!/^\d+(\.\d{1,2})?$/.test(raw)) return false;
  return toCents(raw) > 0n;
};

/**
 * An opening balance may be zero, but it must not be negative and must have at
 * most two decimals.
 */
export const isValidNonNegativeMoney = (value: string | number | null | undefined): boolean => {
  const raw = typeof value === "number" ? value.toString() : (value ?? "").trim();
  return /^\d+(\.\d{1,2})?$/.test(raw);
};
