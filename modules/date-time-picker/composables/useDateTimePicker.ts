import { DateTimePicker } from '../DateTimePicker'
import type { DateTimePickerOptions } from '../types'

export function useDateTimePicker(options: DateTimePickerOptions = {}) {
  const picker = new DateTimePicker(options)
  
  return {
    selectedDate: picker.getSelectedDate(),
    selectedTime: picker.getSelectedTime(),
    dateRange: picker.getDateRange(),
    mode: picker.getMode(),
    dateTimeMode: picker.getDateTimeMode(),
    error: picker.getError(),
    isValid: picker.isValid(),
    formattedValue: picker.getFormattedValue(),
    isoValue: picker.getISOValue(),
    
    setDate: picker.setDate.bind(picker),
    setTime: picker.setTime.bind(picker),
    setDateRange: picker.setDateRange.bind(picker),
    setMinDate: picker.setMinDate.bind(picker),
    setMaxDate: picker.setMaxDate.bind(picker),
    setTimezone: picker.setTimezone.bind(picker),
    setLocale: picker.setLocale.bind(picker),
    setFormat: picker.setFormat.bind(picker),
    toUTC: picker.toUTC.bind(picker),
    toLocal: picker.toLocal.bind(picker),
    validate: picker.validate.bind(picker),
    reset: picker.reset.bind(picker),
    clear: picker.clear.bind(picker),
  }
}
