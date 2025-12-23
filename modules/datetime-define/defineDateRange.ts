import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { startOfDay } from 'date-fns'
import { registerDateTime } from './store/registry'
import {
  formatDate,
  parseDate,
  toISO,
} from './utils/format'
import {
  isValidDate,
  validateRange,
  correctDate,
} from './utils/validation'
import type { DateRangeOptions, DateRange, DateTimeError } from './types'
import type { Locale } from 'date-fns'

interface FormattedRange {
  start: string | null
  end: string | null
}

interface ISORange {
  start: string | null
  end: string | null
}

interface DateRangeReturn {
  dateRange: ComputedRef<DateRange>
  startDate: ComputedRef<Date | null>
  endDate: ComputedRef<Date | null>
  formattedValue: ComputedRef<FormattedRange>
  isoValue: ComputedRef<ISORange>
  error: ComputedRef<DateTimeError | null>
  isValid: ComputedRef<boolean>
  minDate: ComputedRef<Date | null>
  maxDate: ComputedRef<Date | null>
  format: ComputedRef<string>
  setStartDate: (date: Date | string | null) => void
  setEndDate: (date: Date | string | null) => void
  setDateRange: (start: Date | string | null, end: Date | string | null) => void
  setMinDate: (date: Date | null) => void
  setMaxDate: (date: Date | null) => void
  setLocale: (locale: Locale) => void
  setFormat: (format: string) => void
  validate: () => boolean
  reset: () => void
  clear: () => void
}

function createDateRange(options: DateRangeOptions = {}): DateRangeReturn {
  const startDate: Ref<Date | null> = ref(options.initialRange?.start || null)
  const endDate: Ref<Date | null> = ref(options.initialRange?.end || null)
  const minDate: Ref<Date | null> = ref(
    options.minDate || (options.defaultToNow ? startOfDay(new Date()) : null)
  )
  const maxDate: Ref<Date | null> = ref(options.maxDate || null)
  const locale: Ref<Locale | undefined> = ref(options.locale)
  const dateFormat = ref(options.format || 'yyyy-MM-dd')
  const autoCorrect = options.autoCorrect || false
  const error: Ref<DateTimeError | null> = ref(null)

  const dateRange = computed<DateRange>(() => ({
    start: startDate.value,
    end: endDate.value,
  }))

  const isValid = computed(() => {
    if (!startDate.value || !endDate.value) return false
    if (error.value) return false
    return isValidDate(startDate.value) && isValidDate(endDate.value)
  })

  const formattedValue = computed<FormattedRange>(() => ({
    start: startDate.value ? formatDate(startDate.value, dateFormat.value, locale.value) : null,
    end: endDate.value ? formatDate(endDate.value, dateFormat.value, locale.value) : null,
  }))

  const isoValue = computed<ISORange>(() => ({
    start: startDate.value ? toISO(startDate.value) : null,
    end: endDate.value ? toISO(endDate.value) : null,
  }))

  const parseDateInput = (date: Date | string | null): Date | null => {
    if (!date) return null
    if (date instanceof Date) return date
    return parseDate(date)
  }

  const validateAndCorrectRange = (
    start: Date | null,
    end: Date | null
  ): DateRange | null => {
    if (!start && !end) {
      error.value = null
      return { start: null, end: null }
    }

    if (start && !isValidDate(start)) {
      error.value = { type: 'invalid', message: 'Invalid start date' }
      return null
    }

    if (end && !isValidDate(end)) {
      error.value = { type: 'invalid', message: 'Invalid end date' }
      return null
    }

    const validationError = validateRange(start, end, minDate.value, maxDate.value)

    if (validationError) {
      if (autoCorrect && start && end) {
        const correctedStart = correctDate(start, minDate.value, maxDate.value)
        const correctedEnd = correctDate(end, minDate.value, maxDate.value)
        error.value = null
        return { start: correctedStart, end: correctedEnd }
      }
      error.value = validationError
      return null
    }

    error.value = null
    return { start, end }
  }

  const setStartDate = (date: Date | string | null) => {
    const parsed = parseDateInput(date)
    const validated = validateAndCorrectRange(parsed, endDate.value)
    if (validated) {
      startDate.value = validated.start
    }
  }

  const setEndDate = (date: Date | string | null) => {
    const parsed = parseDateInput(date)
    const validated = validateAndCorrectRange(startDate.value, parsed)
    if (validated) {
      endDate.value = validated.end
    }
  }

  const setDateRange = (start: Date | string | null, end: Date | string | null) => {
    const parsedStart = parseDateInput(start)
    const parsedEnd = parseDateInput(end)
    const validated = validateAndCorrectRange(parsedStart, parsedEnd)
    if (validated) {
      startDate.value = validated.start
      endDate.value = validated.end
    }
  }

  const setMinDate = (date: Date | null) => {
    minDate.value = date
    validate()
  }

  const setMaxDate = (date: Date | null) => {
    maxDate.value = date
    validate()
  }

  const setLocale = (loc: Locale) => {
    locale.value = loc
  }

  const setFormat = (fmt: string) => {
    dateFormat.value = fmt
  }

  const validate = (): boolean => {
    const validationError = validateRange(
      startDate.value,
      endDate.value,
      minDate.value,
      maxDate.value
    )
    error.value = validationError
    return validationError === null
  }

  const reset = () => {
    startDate.value = null
    endDate.value = null
    error.value = null
  }

  const clear = () => {
    reset()
    minDate.value = null
    maxDate.value = null
  }

  return {
    dateRange,
    startDate: computed(() => startDate.value),
    endDate: computed(() => endDate.value),
    formattedValue,
    isoValue,
    error: computed(() => error.value),
    isValid,
    minDate: computed(() => minDate.value),
    maxDate: computed(() => maxDate.value),
    format: computed(() => dateFormat.value),
    setStartDate,
    setEndDate,
    setDateRange,
    setMinDate,
    setMaxDate,
    setLocale,
    setFormat,
    validate,
    reset,
    clear,
  }
}

export function defineDateRange(
  id: string,
  options: DateRangeOptions = {}
): () => DateRangeReturn {
  return registerDateTime(id, () => createDateRange(options))
}
