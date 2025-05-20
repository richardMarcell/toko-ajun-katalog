import { clsx, type ClassValue } from "clsx";
import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  addYears,
  format,
} from "date-fns";
import { twMerge } from "tailwind-merge";
import * as yup from "yup";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  const words = name.split(" ");
  return words.length > 1
    ? `${words[0][0]}${words[1][0]}`.toUpperCase()
    : words[0][0].toUpperCase();
}

export function formatNumberToCurrency(number: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}

export function calculateValueFromPercentage(
  baseValue: number,
  percentage: number,
): number {
  return (baseValue * percentage) / 100;
}

export function formaterDate(
  date: Date,
  type:
    | "dateTime"
    | "dateTimeSecond"
    | "date"
    | "time"
    | "shortDate"
    | "dateTimeLocal",
  isUtc: boolean = true,
): string {
  let formatType;

  switch (type) {
    case "date":
      formatType = "dd MMMM yyyy";
      break;
    case "time":
      formatType = "HH:mm:ss";
      break;
    case "shortDate":
      formatType = "yyyy-MM-dd";
      break;
    case "dateTimeSecond":
      formatType = "yyyy-MM-dd HH:mm:ss";
      break;
    case "dateTimeLocal":
      formatType = "yyyy-MM-dd'T'HH:mm";
      break;
    default:
      formatType = "dd MMMM yyyy HH:mm";
      break;
  }

  // Remove Z for timezone not UTC
  return format(isUtc ? date.toISOString().replace("Z", "") : date, formatType);
}

export function addToDate(
  date: Date,
  amount: number,
  unit: "hour" | "day" | "week" | "month" | "year",
): Date {
  switch (unit) {
    case "hour":
      return addHours(date, amount);
    case "day":
      return addDays(date, amount);
    case "week":
      return addWeeks(date, amount);
    case "month":
      return addMonths(date, amount);
    case "year":
      return addYears(date, amount);
    default:
      throw new Error(
        'Invalid time unit. Please use "day", "week", "hour", or "year".',
      );
  }
}
/* eslint-disable @typescript-eslint/no-explicit-any */
export function createYupValidationError(
  field: string,
  value: any,
  message: string,
): yup.ValidationError {
  const validationError = new yup.ValidationError([], { [field]: value }, "");
  validationError.inner.push(new yup.ValidationError(message, value, field));

  return validationError;
}

export function removeDateTimezone(date: Date): string {
  const dateString = date.toISOString().replace("Z", "");

  return dateString;
}

function getLocalDatetime(): Date {
  const now = new Date();
  const utcMillis = now.getTime();
  const jakartaOffsetMillis = 7 * 60 * 60 * 1000; // +07:00 offset

  return new Date(utcMillis + jakartaOffsetMillis);
}

export function getCurrentDate(): Date {
  return getLocalDatetime();
}

export function getDateStartTime(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const utcMillis = now.getTime();
  const jakartaOffsetMillis = 7 * 60 * 60 * 1000; // +07:00 offset

  return new Date(utcMillis + jakartaOffsetMillis);
}

/**
 * Round a currency amount to the nearest multiple of 10,000.
 * @param amount The original amount.
 * @returns Rounded amount.
 */
export function roundCurrency(amount: number): number {
  const factor = 10000;

  return Math.round(amount / factor) * factor;
}
