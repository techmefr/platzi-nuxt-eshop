import type { Locale } from 'date-fns'

export interface DateRange {
  start: Date | null
  end: Date | null
}

export type DatePickerMode = 'single' | 'range'

export type DateTimeMode = 'date' | 'datetime' | 'time'

export interface DateTimeError {
  type: 'min' | 'max' | 'range' | 'invalid'
  message: string
}

export interface BaseDateOptions {
  minDate?: Date
  maxDate?: Date
  timezone?: string
  locale?: Locale
  format?: string
  autoCorrect?: boolean
  defaultToNow?: boolean
}

export interface DateOptions extends BaseDateOptions {
  initialDate?: Date | null
}

export interface DatetimeOptions extends BaseDateOptions {
  initialDate?: Date | null
  initialTime?: string | null
}

export interface DateRangeOptions extends BaseDateOptions {
  initialRange?: DateRange
}
