import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { startOfDay } from 'date-fns'
import { registerDateTime } from './store/registry'
import {
  formatDate,
  parseDate,
  toISO,
  toUTC,
  toLocalDate,
  combineDateTime,
  extractTime,
} from './utils/format'
import {
  isValidDate,
  validateDateTime,
  correctDate,
} from './utils/validation'
import type { DatetimeOptions, DateTimeError } from './types'
import type { Locale } from 'date-fns'

interface DatetimeReturn {
  selectedDate: ComputedRef<Date | null>
  selectedTime: ComputedRef<string | null>
  combinedDateTime: ComputedRef<Date | null>
  formattedValue: ComputedRef<string | null>
  isoValue: ComputedRef<string | null>
  error: ComputedRef<DateTimeError | null>
  isValid: ComputedRef<boolean>
  minDate: ComputedRef<Date | null>
  maxDate: ComputedRef<Date | null>
  format: ComputedRef<string>
  timezone: ComputedRef<string>
  setDate: (date: Date | string | null) => void
  setTime: (time: string | null) => void
  setDateTime: (date: Date | string | null, time: string | null) => void
  setMinDate: (date: Date | null) => void
  setMaxDate: (date: Date | null) => void
  setTimezone: (timezone: string) => void
  setLocale: (locale: Locale) => void
  setFormat: (format: string) => void
  toUTC: () => Date | null
  toLocal: () => Date | null
  validate: () => boolean
  reset: () => void
  clear: () => void
}

function createDatetime(options: DatetimeOptions = {}): DatetimeReturn {
  const selectedDate: Ref<Date | null> = ref(options.initialDate || null)
  const selectedTime: Ref<string | null> = ref(options.initialTime || null)
  const minDate: Ref<Date | null> = ref(
    options.minDate || (options.defaultToNow ? startOfDay(new Date()) : null)
  )
  const maxDate: Ref<Date | null> = ref(options.maxDate || null)
  const timezone = ref(options.timezone || 'local')
  const locale: Ref<Locale | undefined> = ref(options.locale)
  const dateFormat = ref(options.format || 'yyyy-MM-dd HH:mm')
  const autoCorrect = options.autoCorrect || false
  const error: Ref<DateTimeError | null> = ref(null)

  const combinedDateTime = computed(() => {
    if (!selectedDate.value) return null
    if (!selectedTime.value) return selectedDate.value
    return combineDateTime(selectedDate.value, selectedTime.value)
  })

  const isValid = computed(() => {
    if (!selectedDate.value) return false
    if (error.value) return false
    return isValidDate(selectedDate.value)
  })

  const formattedValue = computed(() => {
    const dateTime = combinedDateTime.value
    if (!dateTime) return null
    return formatDate(dateTime, dateFormat.value, locale.value)
  })

  const isoValue = computed(() => {
    const dateTime = combinedDateTime.value
    if (!dateTime) return null
    return toISO(dateTime)
  })

  const parseDateInput = (date: Date | string | null): Date | null => {
    if (!date) return null
    if (date instanceof Date) return date
    return parseDate(date)
  }

  const validateAndCorrectDate = (date: Date): Date | null => {
    if (!isValidDate(date)) {
      error.value = { type: 'invalid', message: 'Invalid date' }
      return null
    }

    const validationError = validateDateTime(date, minDate.value, maxDate.value)

    if (validationError) {
      if (autoCorrect) {
        const corrected = correctDate(date, minDate.value, maxDate.value)
        error.value = null
        return corrected
      }
      error.value = validationError
      return null
    }

    error.value = null
    return date
  }

  const setDate = (date: Date | string | null) => {
    const parsed = parseDateInput(date)
    if (!parsed) {
      selectedDate.value = null
      error.value = null
      return
    }

    const validated = validateAndCorrectDate(parsed)
    if (validated) {
      selectedDate.value = validated
      if (!selectedTime.value) {
        selectedTime.value = extractTime(validated)
      }
    }
  }

  const setTime = (time: string | null) => {
    selectedTime.value = time
  }

  const setDateTime = (date: Date | string | null, time: string | null) => {
    setDate(date)
    setTime(time)
  }

  const setMinDate = (date: Date | null) => {
    minDate.value = date
    if (selectedDate.value) {
      validate()
    }
  }

  const setMaxDate = (date: Date | null) => {
    maxDate.value = date
    if (selectedDate.value) {
      validate()
    }
  }

  const setTimezone = (tz: string) => {
    timezone.value = tz
  }

  const setLocale = (loc: Locale) => {
    locale.value = loc
  }

  const setFormat = (fmt: string) => {
    dateFormat.value = fmt
  }

  const toUTCDate = (): Date | null => {
    const dateTime = combinedDateTime.value
    if (!dateTime) return null
    if (timezone.value === 'UTC' || timezone.value === 'local') {
      return dateTime
    }
    return toUTC(dateTime, timezone.value)
  }

  const toLocalDateFn = (): Date | null => {
    const dateTime = combinedDateTime.value
    if (!dateTime) return null
    if (timezone.value === 'local') return dateTime
    return toLocalDate(dateTime, timezone.value)
  }

  const validate = (): boolean => {
    if (!selectedDate.value) return false
    const validationError = validateDateTime(
      selectedDate.value,
      minDate.value,
      maxDate.value
    )
    error.value = validationError
    return validationError === null
  }

  const reset = () => {
    selectedDate.value = null
    selectedTime.value = null
    error.value = null
  }

  const clear = () => {
    reset()
    minDate.value = null
    maxDate.value = null
  }

  return {
    selectedDate: computed(() => selectedDate.value),
    selectedTime: computed(() => selectedTime.value),
    combinedDateTime,
    formattedValue,
    isoValue,
    error: computed(() => error.value),
    isValid,
    minDate: computed(() => minDate.value),
    maxDate: computed(() => maxDate.value),
    format: computed(() => dateFormat.value),
    timezone: computed(() => timezone.value),
    setDate,
    setTime,
    setDateTime,
    setMinDate,
    setMaxDate,
    setTimezone,
    setLocale,
    setFormat,
    toUTC: toUTCDate,
    toLocal: toLocalDateFn,
    validate,
    reset,
    clear,
  }
}

export function defineDatetime(
  id: string,
  options: DatetimeOptions = {}
): () => DatetimeReturn {
  return registerDateTime(id, () => createDatetime(options))
}
