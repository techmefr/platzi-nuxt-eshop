import { describe, it, expect, beforeEach } from 'vitest'
import { DateTimeState } from '../DateTimeState'
import { DateTimeValidator } from '../DateTimeValidator'

describe('DateTimeValidator', () => {
  let state: DateTimeState
  let validator: DateTimeValidator

  beforeEach(() => {
    state = new DateTimeState()
    validator = new DateTimeValidator(state)
  })

  it('isValid retourne false quand aucune date n\'est sélectionnée', () => {
    expect(validator.isValid().value).toBe(false)
  })

  it('isValid retourne true quand une date valide est sélectionnée', () => {
    state.setSelectedDate(new Date('2024-01-15'))
    expect(validator.isValid().value).toBe(true)
  })

  it('isValid retourne false en présence d\'une erreur', () => {
    state.setSelectedDate(new Date('2024-01-15'))
    state.setError({ type: 'min', message: 'Erreur' })

    expect(validator.isValid().value).toBe(false)
  })

  it('validate retourne true pour une date valide', () => {
    state.setSelectedDate(new Date('2024-06-15'))
    state.setMinDate(new Date('2024-01-01'))
    state.setMaxDate(new Date('2024-12-31'))

    expect(validator.validate()).toBe(true)
    expect(state.getError().value).toBeNull()
  })

  it('validate retourne false pour une date inférieure au minimum', () => {
    state.setSelectedDate(new Date('2023-12-15'))
    state.setMinDate(new Date('2024-01-01'))

    expect(validator.validate()).toBe(false)
    expect(state.getError().value?.type).toBe('min')
  })

  it('validate retourne false pour une date supérieure au maximum', () => {
    state.setSelectedDate(new Date('2025-01-15'))
    state.setMaxDate(new Date('2024-12-31'))

    expect(validator.validate()).toBe(false)
    expect(state.getError().value?.type).toBe('max')
  })

  it('validateAndCorrectDate retourne null pour une date invalide', () => {
    const result = validator.validateAndCorrectDate(new Date('invalid'))

    expect(result).toBeNull()
    expect(state.getError().value?.type).toBe('invalid')
  })

  it('validateAndCorrectDate retourne null sans auto-correction', () => {
    state.setMinDate(new Date('2024-01-01'))
    const result = validator.validateAndCorrectDate(new Date('2023-12-15'))

    expect(result).toBeNull()
    expect(state.getError().value?.type).toBe('min')
  })

  it('validateAndCorrectDate corrige la date avec auto-correction', () => {
    const stateWithAutoCorrect = new DateTimeState({ 
      autoCorrect: true,
      minDate: new Date('2024-01-01')
    })
    const validatorWithAutoCorrect = new DateTimeValidator(stateWithAutoCorrect)

    const result = validatorWithAutoCorrect.validateAndCorrectDate(new Date('2023-12-15'))

    expect(result).toEqual(new Date('2024-01-01'))
    expect(stateWithAutoCorrect.getError().value).toBeNull()
  })

  it('validateAndCorrectRange valide une plage correcte', () => {
    const start = new Date('2024-01-01')
    const end = new Date('2024-01-31')

    const result = validator.validateAndCorrectRange(start, end)

    expect(result).toEqual({ start, end })
    expect(state.getError().value).toBeNull()
  })

  it('validateAndCorrectRange retourne null pour une plage invalide', () => {
    const start = new Date('2024-01-31')
    const end = new Date('2024-01-01')

    const result = validator.validateAndCorrectRange(start, end)

    expect(result).toBeNull()
    expect(state.getError().value?.type).toBe('range')
  })

  it('validateAndCorrectRange corrige avec auto-correction', () => {
    const stateWithAutoCorrect = new DateTimeState({ 
      autoCorrect: true,
      minDate: new Date('2024-01-01'),
      maxDate: new Date('2024-12-31')
    })
    const validatorWithAutoCorrect = new DateTimeValidator(stateWithAutoCorrect)

    const result = validatorWithAutoCorrect.validateAndCorrectRange(
      new Date('2023-12-15'),
      new Date('2025-01-15')
    )

    expect(result?.start).toEqual(new Date('2024-01-01'))
    expect(result?.end).toEqual(new Date('2024-12-31'))
  })

  it('isValid pour mode range retourne false si start ou end manquent', () => {
    const rangeState = new DateTimeState({ mode: 'range' })
    const rangeValidator = new DateTimeValidator(rangeState)

    rangeState.setDateRange({ start: new Date('2024-01-01'), end: null })

    expect(rangeValidator.isValid().value).toBe(false)
  })

  it('isValid pour mode range retourne true si start et end sont présents', () => {
    const rangeState = new DateTimeState({ mode: 'range' })
    const rangeValidator = new DateTimeValidator(rangeState)

    rangeState.setDateRange({ 
      start: new Date('2024-01-01'), 
      end: new Date('2024-01-31') 
    })

    expect(rangeValidator.isValid().value).toBe(true)
  })
})
