import type { Locale } from 'date-fns'

export interface DateRange {
  start: Date | null
  end: Date | null
}

export type DatePickerMode = 'single' | 'range' | 'multiple'

export type DateTimeMode = 'date' | 'datetime' | 'time'

export interface DateTimePickerOptions {
  mode?: DatePickerMode
  dateTimeMode?: DateTimeMode
  minDate?: Date
  maxDate?: Date
  timezone?: string
  locale?: Locale
  format?: string
  autoCorrect?: boolean
  defaultToNow?: boolean
}

export interface DateTimeError {
  type: 'min' | 'max' | 'range' | 'invalid'
  message: string
}
