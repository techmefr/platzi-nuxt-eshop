import { startOfDay } from 'date-fns'
import type { Locale } from 'date-fns'
import type { 
  DateTimeMode, 
  DatePickerMode,
  DateRange,
  DateTimePickerOptions,
  DateTimeError 
} from './types'

export class DateTimeState {
  protected selectedDate = ref<Date | null>(null)
  protected selectedTime = ref<string | null>(null)
  protected dateRange = ref<DateRange>({ start: null, end: null })
  protected mode = ref<DatePickerMode>('single')
  protected dateTimeMode = ref<DateTimeMode>('date')
  protected minDate = ref<Date | null>(null)
  protected maxDate = ref<Date | null>(null)
  protected timezone = ref<string>('local')
  protected locale = ref<Locale | undefined>(undefined)
  protected format = ref<string>('yyyy-MM-dd')
  protected isAutoCorrect = ref<boolean>(false)
  protected error = ref<DateTimeError | null>(null)

  constructor(options: DateTimePickerOptions = {}) {
    this.mode.value = options.mode || 'single'
    this.dateTimeMode.value = options.dateTimeMode || 'date'
    this.format.value = options.format || 'yyyy-MM-dd'
    this.isAutoCorrect.value = options.autoCorrect ?? false
    this.timezone.value = options.timezone || 'local'
    this.locale.value = options.locale
    
    if (options.minDate) {
      this.minDate.value = options.minDate
    } else if (options.defaultToNow) {
      this.minDate.value = startOfDay(new Date())
    }
    
    if (options.maxDate) {
      this.maxDate.value = options.maxDate
    }
  }

  getSelectedDate() {
    return computed(() => this.selectedDate.value)
  }

  getSelectedTime() {
    return computed(() => this.selectedTime.value)
  }

  getDateRange() {
    return computed(() => this.dateRange.value)
  }

  getMode() {
    return computed(() => this.mode.value)
  }

  getDateTimeMode() {
    return computed(() => this.dateTimeMode.value)
  }

  getError() {
    return computed(() => this.error.value)
  }

  getMinDate() {
    return computed(() => this.minDate.value)
  }

  getMaxDate() {
    return computed(() => this.maxDate.value)
  }

  getTimezone() {
    return computed(() => this.timezone.value)
  }

  getLocale() {
    return computed(() => this.locale.value)
  }

  getFormat() {
    return computed(() => this.format.value)
  }

  getAutoCorrect() {
    return computed(() => this.isAutoCorrect.value)
  }

  setSelectedDate(date: Date | null) {
    this.selectedDate.value = date
  }

  setSelectedTime(time: string | null) {
    this.selectedTime.value = time
  }

  setDateRange(range: DateRange) {
    this.dateRange.value = range
  }

  setError(error: DateTimeError | null) {
    this.error.value = error
  }

  setMinDate(date: Date | null) {
    this.minDate.value = date
  }

  setMaxDate(date: Date | null) {
    this.maxDate.value = date
  }

  setTimezone(timezone: string) {
    this.timezone.value = timezone
  }

  setLocale(locale: Locale) {
    this.locale.value = locale
  }

  setFormat(format: string) {
    this.format.value = format
  }

  reset() {
    this.selectedDate.value = null
    this.selectedTime.value = null
    this.dateRange.value = { start: null, end: null }
    this.error.value = null
  }

  clear() {
    this.reset()
    this.minDate.value = null
    this.maxDate.value = null
  }
}
