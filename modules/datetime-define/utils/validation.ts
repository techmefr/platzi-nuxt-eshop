import { isAfter, isBefore, isEqual, isValid as dateFnsIsValid } from 'date-fns'
import type { DateTimeError } from '../types'

export function isValidDate(date: Date | null): boolean {
  if (!date) return false
  return dateFnsIsValid(date)
}

export function isDateInRange(
  date: Date,
  minDate: Date | null,
  maxDate: Date | null
): boolean {
  if (minDate && isBefore(date, minDate)) return false
  if (maxDate && isAfter(date, maxDate)) return false
  return true
}

export function isRangeValid(start: Date, end: Date): boolean {
  return isBefore(start, end) || isEqual(start, end)
}

export function validateDateTime(
  date: Date,
  minDate: Date | null,
  maxDate: Date | null
): DateTimeError | null {
  if (minDate && isBefore(date, minDate)) {
    return { type: 'min', message: 'Date is before minimum allowed date' }
  }
  if (maxDate && isAfter(date, maxDate)) {
    return { type: 'max', message: 'Date is after maximum allowed date' }
  }
  return null
}

export function validateRange(
  start: Date | null,
  end: Date | null,
  minDate: Date | null,
  maxDate: Date | null
): DateTimeError | null {
  if (start && end && !isRangeValid(start, end)) {
    return { type: 'range', message: 'Start date must be before end date' }
  }
  if (start) {
    const startError = validateDateTime(start, minDate, maxDate)
    if (startError) return startError
  }
  if (end) {
    const endError = validateDateTime(end, minDate, maxDate)
    if (endError) return endError
  }
  return null
}

export function correctDate(
  date: Date,
  minDate: Date | null,
  maxDate: Date | null
): Date {
  if (minDate && isBefore(date, minDate)) return minDate
  if (maxDate && isAfter(date, maxDate)) return maxDate
  return date
}
