import type { DateTimeState } from './DateTimeState'
import { 
  formatDate, 
  parseDate, 
  toISO, 
  toUTC, 
  toLocalDate,
  combineDateTime 
} from './utils'

export class DateTimeFormatter {
  constructor(protected state: DateTimeState) {}

  getFormattedValue() {
    return computed(() => {
      const mode = this.state.getMode().value
      const dateTimeMode = this.state.getDateTimeMode().value
      const format = this.state.getFormat().value
      const locale = this.state.getLocale().value
      
      if (mode === 'single') {
        const selectedDate = this.state.getSelectedDate().value
        if (!selectedDate) return null
        
        if (dateTimeMode === 'datetime') {
          const selectedTime = this.state.getSelectedTime().value
          if (selectedTime) {
            const combined = combineDateTime(selectedDate, selectedTime)
            return combined ? formatDate(combined, format, locale) : null
          }
        }
        
        return formatDate(selectedDate, format, locale)
      } else {
        const range = this.state.getDateRange().value
        return {
          start: range.start ? formatDate(range.start, format, locale) : null,
          end: range.end ? formatDate(range.end, format, locale) : null
        }
      }
    })
  }

  getISOValue() {
    return computed(() => {
      const mode = this.state.getMode().value
      const dateTimeMode = this.state.getDateTimeMode().value
      
      if (mode === 'single') {
        const selectedDate = this.state.getSelectedDate().value
        if (!selectedDate) return null
        
        if (dateTimeMode === 'datetime') {
          const selectedTime = this.state.getSelectedTime().value
          if (selectedTime) {
            const combined = combineDateTime(selectedDate, selectedTime)
            return combined ? toISO(combined) : null
          }
        }
        
        return toISO(selectedDate)
      } else {
        const range = this.state.getDateRange().value
        return {
          start: range.start ? toISO(range.start) : null,
          end: range.end ? toISO(range.end) : null
        }
      }
    })
  }

  parseAndSetDate(value: Date | string | null): Date | null {
    if (!value) return null
    return typeof value === 'string' ? parseDate(value) : value
  }

  toUTC(): Date | null {
    const selectedDate = this.state.getSelectedDate().value
    const timezone = this.state.getTimezone().value
    
    if (selectedDate && timezone !== 'UTC') {
      return toUTC(selectedDate, timezone)
    }
    return selectedDate
  }

  toLocal(): Date | null {
    const selectedDate = this.state.getSelectedDate().value
    const timezone = this.state.getTimezone().value
    
    if (selectedDate && timezone !== 'local') {
      return toLocalDate(selectedDate, timezone)
    }
    return selectedDate
  }
}
