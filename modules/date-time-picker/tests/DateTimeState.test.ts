import { describe, it, expect, beforeEach } from 'vitest'
import { DateTimeState } from '../DateTimeState'

describe('DateTimeState', () => {
  let state: DateTimeState

  beforeEach(() => {
    state = new DateTimeState()
  })

  it('initialise avec les valeurs par défaut', () => {
    expect(state.getMode().value).toBe('single')
    expect(state.getDateTimeMode().value).toBe('date')
    expect(state.getFormat().value).toBe('yyyy-MM-dd')
    expect(state.getAutoCorrect().value).toBe(false)
    expect(state.getTimezone().value).toBe('local')
  })

  it('initialise avec des options personnalisées', () => {
    const customState = new DateTimeState({
      mode: 'range',
      dateTimeMode: 'datetime',
      format: 'dd/MM/yyyy',
      autoCorrect: true,
      timezone: 'UTC'
    })

    expect(customState.getMode().value).toBe('range')
    expect(customState.getDateTimeMode().value).toBe('datetime')
    expect(customState.getFormat().value).toBe('dd/MM/yyyy')
    expect(customState.getAutoCorrect().value).toBe(true)
    expect(customState.getTimezone().value).toBe('UTC')
  })

  it('définit et récupère une date sélectionnée', () => {
    const date = new Date('2024-01-15')
    state.setSelectedDate(date)

    expect(state.getSelectedDate().value).toEqual(date)
  })

  it('définit et récupère une heure sélectionnée', () => {
    state.setSelectedTime('14:30')

    expect(state.getSelectedTime().value).toBe('14:30')
  })

  it('définit et récupère une plage de dates', () => {
    const range = {
      start: new Date('2024-01-01'),
      end: new Date('2024-01-31')
    }
    state.setDateRange(range)

    expect(state.getDateRange().value).toEqual(range)
  })

  it('définit et récupère une erreur', () => {
    const error = { type: 'min' as const, message: 'Date trop ancienne' }
    state.setError(error)

    expect(state.getError().value).toEqual(error)
  })

  it('définit et récupère minDate et maxDate', () => {
    const minDate = new Date('2024-01-01')
    const maxDate = new Date('2024-12-31')

    state.setMinDate(minDate)
    state.setMaxDate(maxDate)

    expect(state.getMinDate().value).toEqual(minDate)
    expect(state.getMaxDate().value).toEqual(maxDate)
  })

  it('définit et récupère le timezone', () => {
    state.setTimezone('Europe/Paris')

    expect(state.getTimezone().value).toBe('Europe/Paris')
  })

  it('définit et récupère le format', () => {
    state.setFormat('dd/MM/yyyy HH:mm')

    expect(state.getFormat().value).toBe('dd/MM/yyyy HH:mm')
  })

  it('reset réinitialise les valeurs sélectionnées', () => {
    state.setSelectedDate(new Date('2024-01-15'))
    state.setSelectedTime('14:30')
    state.setDateRange({ start: new Date('2024-01-01'), end: new Date('2024-01-31') })
    state.setError({ type: 'min', message: 'Erreur' })

    state.reset()

    expect(state.getSelectedDate().value).toBeNull()
    expect(state.getSelectedTime().value).toBeNull()
    expect(state.getDateRange().value).toEqual({ start: null, end: null })
    expect(state.getError().value).toBeNull()
  })

  it('clear réinitialise tout y compris min/max', () => {
    state.setSelectedDate(new Date('2024-01-15'))
    state.setMinDate(new Date('2024-01-01'))
    state.setMaxDate(new Date('2024-12-31'))

    state.clear()

    expect(state.getSelectedDate().value).toBeNull()
    expect(state.getMinDate().value).toBeNull()
    expect(state.getMaxDate().value).toBeNull()
  })

  it('initialise avec defaultToNow', () => {
    const stateWithNow = new DateTimeState({ defaultToNow: true })

    expect(stateWithNow.getMinDate().value).not.toBeNull()
  })
})
