import { isAfter, isBefore, isEqual, isValid as dateFnsIsValid } from 'date-fns'
import type { DateTimeError } from '../types'

export function isValidDate(date: Date | null): boolean {
  if (!date) return false
  return dateFnsIsValid(date)
}

export function isDateInRange(
  date: Date,
  minDate?: Date | null,
  maxDate?: Date | null
): boolean {
  if (minDate && isBefore(date, minDate)) return false
  if (maxDate && isAfter(date, maxDate)) return false
  return true
}

export function isRangeValid(start: Date | null, end: Date | null): boolean {
  if (!start || !end) return true
  return isBefore(start, end) || isEqual(start, end)
}

export function validateDateTime(
  date: Date | null,
  minDate?: Date | null,
  maxDate?: Date | null
): DateTimeError | null {
  if (!date) return null
  
  if (!isValidDate(date)) {
    return { type: 'invalid', message: 'Date invalide' }
  }
  
  if (minDate && isBefore(date, minDate)) {
    return { type: 'min', message: 'La date est antérieure à la date minimale' }
  }
  
  if (maxDate && isAfter(date, maxDate)) {
    return { type: 'max', message: 'La date est postérieure à la date maximale' }
  }
  
  return null
}

export function validateRange(
  start: Date | null,
  end: Date | null,
  minDate?: Date | null,
  maxDate?: Date | null
): DateTimeError | null {
  const startError = validateDateTime(start, minDate, maxDate)
  if (startError) return startError
  
  const endError = validateDateTime(end, minDate, maxDate)
  if (endError) return endError
  
  if (start && end && !isRangeValid(start, end)) {
    return { 
      type: 'range', 
      message: 'La date de fin doit être postérieure à la date de début' 
    }
  }
  
  return null
}

export function correctDate(
  date: Date,
  minDate?: Date | null,
  maxDate?: Date | null
): Date {
  if (minDate && isBefore(date, minDate)) return minDate
  if (maxDate && isAfter(date, maxDate)) return maxDate
  return date
}
