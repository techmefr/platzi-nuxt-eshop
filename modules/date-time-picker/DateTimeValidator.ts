import type { DateTimeState } from './DateTimeState'
import { 
  isValidDate, 
  validateDateTime, 
  validateRange, 
  correctDate 
} from './utils'

export class DateTimeValidator {
  constructor(protected state: DateTimeState) {}

  isValid() {
    return computed(() => {
      const mode = this.state.getMode().value
      const error = this.state.getError().value
      
      if (mode === 'single') {
        return error === null && this.state.getSelectedDate().value !== null
      } else {
        const range = this.state.getDateRange().value
        return error === null && range.start !== null && range.end !== null
      }
    })
  }

  validate(): boolean {
    const mode = this.state.getMode().value
    const minDate = this.state.getMinDate().value
    const maxDate = this.state.getMaxDate().value
    
    if (mode === 'single') {
      const selectedDate = this.state.getSelectedDate().value
      const validationError = validateDateTime(selectedDate, minDate, maxDate)
      this.state.setError(validationError)
      return validationError === null
    } else {
      const range = this.state.getDateRange().value
      const validationError = validateRange(range.start, range.end, minDate, maxDate)
      this.state.setError(validationError)
      return validationError === null
    }
  }

  validateAndCorrectDate(date: Date): Date | null {
    const minDate = this.state.getMinDate().value
    const maxDate = this.state.getMaxDate().value
    const isAutoCorrect = this.state.getAutoCorrect().value
    
    if (!isValidDate(date)) {
      this.state.setError({ type: 'invalid', message: 'Date invalide' })
      return null
    }
    
    const validationError = validateDateTime(date, minDate, maxDate)
    
    if (validationError && !isAutoCorrect) {
      this.state.setError(validationError)
      return null
    }
    
    const correctedDate = isAutoCorrect 
      ? correctDate(date, minDate, maxDate)
      : date
    
    this.state.setError(null)
    return correctedDate
  }

  validateAndCorrectRange(start: Date | null, end: Date | null): { start: Date | null; end: Date | null } | null {
    const minDate = this.state.getMinDate().value
    const maxDate = this.state.getMaxDate().value
    const isAutoCorrect = this.state.getAutoCorrect().value
    
    const validationError = validateRange(start, end, minDate, maxDate)
    
    if (validationError && !isAutoCorrect) {
      this.state.setError(validationError)
      return null
    }
    
    const correctedStart = start && isAutoCorrect 
      ? correctDate(start, minDate, maxDate)
      : start
    
    const correctedEnd = end && isAutoCorrect 
      ? correctDate(end, minDate, maxDate)
      : end
    
    this.state.setError(null)
    return { start: correctedStart, end: correctedEnd }
  }
}
