import type { DateTimePickerOptions } from './types'
import { DateTimeState } from './DateTimeState'
import { DateTimeValidator } from './DateTimeValidator'
import { DateTimeFormatter } from './DateTimeFormatter'
import type { Locale } from 'date-fns'

export class DateTimePicker {
  protected state: DateTimeState
  protected validator: DateTimeValidator
  protected formatter: DateTimeFormatter

  constructor(options: DateTimePickerOptions = {}) {
    this.state = new DateTimeState(options)
    this.validator = new DateTimeValidator(this.state)
    this.formatter = new DateTimeFormatter(this.state)
  }

  getSelectedDate() {
    return this.state.getSelectedDate()
  }

  getSelectedTime() {
    return this.state.getSelectedTime()
  }

  getDateRange() {
    return this.state.getDateRange()
  }

  getMode() {
    return this.state.getMode()
  }

  getDateTimeMode() {
    return this.state.getDateTimeMode()
  }

  getError() {
    return this.state.getError()
  }

  isValid() {
    return this.validator.isValid()
  }

  getFormattedValue() {
    return this.formatter.getFormattedValue()
  }

  getISOValue() {
    return this.formatter.getISOValue()
  }

  setDate(date: Date | string | null) {
    const parsedDate = this.formatter.parseAndSetDate(date)
    if (!parsedDate) {
      this.state.setSelectedDate(null)
      this.state.setError(null)
      return
    }
    
    const validatedDate = this.validator.validateAndCorrectDate(parsedDate)
    if (validatedDate) {
      this.state.setSelectedDate(validatedDate)
    }
  }

  setTime(time: string | null) {
    this.state.setSelectedTime(time)
  }

  setDateRange(start: Date | string | null, end: Date | string | null) {
    const parsedStart = this.formatter.parseAndSetDate(start)
    const parsedEnd = this.formatter.parseAndSetDate(end)
    
    const validatedRange = this.validator.validateAndCorrectRange(parsedStart, parsedEnd)
    if (validatedRange) {
      this.state.setDateRange(validatedRange)
    }
  }

  setMinDate(date: Date | null) {
    this.state.setMinDate(date)
    this.validator.validate()
  }

  setMaxDate(date: Date | null) {
    this.state.setMaxDate(date)
    this.validator.validate()
  }

  setTimezone(timezone: string) {
    this.state.setTimezone(timezone)
  }

  setLocale(locale: Locale) {
    this.state.setLocale(locale)
  }

  setFormat(format: string) {
    this.state.setFormat(format)
  }

  toUTC() {
    return this.formatter.toUTC()
  }

  toLocal() {
    return this.formatter.toLocal()
  }

  validate() {
    return this.validator.validate()
  }

  reset() {
    this.state.reset()
  }

  clear() {
    this.state.clear()
  }
}
