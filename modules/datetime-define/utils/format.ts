import {
  format as dateFnsFormat,
  parseISO,
  formatISO,
} from 'date-fns'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'
import type { Locale } from 'date-fns'

export function formatDate(
  date: Date,
  formatStr: string = 'yyyy-MM-dd',
  locale?: Locale
): string {
  return dateFnsFormat(date, formatStr, { locale })
}

export function parseDate(dateString: string): Date | null {
  try {
    const parsed = parseISO(dateString)
    return isNaN(parsed.getTime()) ? null : parsed
  } catch {
    return null
  }
}

export function toISO(date: Date): string {
  return formatISO(date)
}

export function toUTC(date: Date, timezone: string = 'UTC'): Date {
  return fromZonedTime(date, timezone)
}

export function toLocalDate(date: Date, timezone: string): Date {
  return toZonedTime(date, timezone)
}

export function combineDateTime(date: Date, time: string): Date | null {
  try {
    const [hours, minutes] = time.split(':').map(Number)
    if (isNaN(hours) || isNaN(minutes)) return null

    const combined = new Date(date)
    combined.setHours(hours, minutes, 0, 0)
    return combined
  } catch {
    return null
  }
}

export function extractTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}
