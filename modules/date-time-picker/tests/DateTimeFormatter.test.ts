import { describe, it, expect, beforeEach } from 'vitest'
import { DateTimeState } from '../DateTimeState'
import { DateTimeFormatter } from '../DateTimeFormatter'

describe('DateTimeFormatter', () => {
  let state: DateTimeState
  let formatter: DateTimeFormatter

  beforeEach(() => {
    state = new DateTimeState()
    formatter = new DateTimeFormatter(state)
  })

  it('getFormattedValue retourne null si aucune date n\'est sélectionnée', () => {
    expect(formatter.getFormattedValue().value).toBeNull()
  })

  it('getFormattedValue formate une date avec le format par défaut', () => {
    state.setSelectedDate(new Date('2024-01-15'))

    expect(formatter.getFormattedValue().value).toBe('2024-01-15')
  })

  it('getFormattedValue formate une date avec un format personnalisé', () => {
    state.setFormat('dd/MM/yyyy')
    state.setSelectedDate(new Date('2024-01-15'))

    expect(formatter.getFormattedValue().value).toBe('15/01/2024')
  })

  it('getFormattedValue combine date et heure en mode datetime', () => {
    const datetimeState = new DateTimeState({ dateTimeMode: 'datetime' })
    const datetimeFormatter = new DateTimeFormatter(datetimeState)

    datetimeState.setSelectedDate(new Date('2024-01-15'))
    datetimeState.setSelectedTime('14:30')

    const formatted = datetimeFormatter.getFormattedValue().value
    expect(formatted).toContain('2024-01-15')
  })

  it('getFormattedValue pour mode range', () => {
    const rangeState = new DateTimeState({ mode: 'range' })
    const rangeFormatter = new DateTimeFormatter(rangeState)

    rangeState.setDateRange({
      start: new Date('2024-01-01'),
      end: new Date('2024-01-31')
    })

    const formatted = rangeFormatter.getFormattedValue().value
    expect(formatted).toHaveProperty('start', '2024-01-01')
    expect(formatted).toHaveProperty('end', '2024-01-31')
  })

  it('getISOValue retourne null si aucune date n\'est sélectionnée', () => {
    expect(formatter.getISOValue().value).toBeNull()
  })

  it('getISOValue retourne une date au format ISO', () => {
    state.setSelectedDate(new Date('2024-01-15T10:30:00'))

    const iso = formatter.getISOValue().value
    expect(iso).toContain('2024-01-15')
  })

  it('getISOValue pour mode range', () => {
    const rangeState = new DateTimeState({ mode: 'range' })
    const rangeFormatter = new DateTimeFormatter(rangeState)

    rangeState.setDateRange({
      start: new Date('2024-01-01'),
      end: new Date('2024-01-31')
    })

    const iso = rangeFormatter.getISOValue().value
    expect(iso).toHaveProperty('start')
    expect(iso).toHaveProperty('end')
    expect(iso.start).toContain('2024-01-01')
  })

  it('parseAndSetDate parse une date string', () => {
    const result = formatter.parseAndSetDate('2024-01-15')

    expect(result).toBeInstanceOf(Date)
    expect(result?.getFullYear()).toBe(2024)
  })

  it('parseAndSetDate retourne null pour null', () => {
    expect(formatter.parseAndSetDate(null)).toBeNull()
  })

  it('parseAndSetDate retourne la date si déjà un objet Date', () => {
    const date = new Date('2024-01-15')
    const result = formatter.parseAndSetDate(date)

    expect(result).toEqual(date)
  })

  it('toUTC convertit en UTC', () => {
    state.setSelectedDate(new Date('2024-01-15T10:30:00'))
    state.setTimezone('Europe/Paris')

    const utc = formatter.toUTC()
    expect(utc).toBeInstanceOf(Date)
  })

  it('toUTC retourne la date inchangée si timezone est UTC', () => {
    const date = new Date('2024-01-15T10:30:00')
    state.setSelectedDate(date)
    state.setTimezone('UTC')

    const utc = formatter.toUTC()
    expect(utc).toEqual(date)
  })

  it('toLocal convertit en local', () => {
    state.setSelectedDate(new Date('2024-01-15T10:30:00Z'))
    state.setTimezone('Europe/Paris')

    const local = formatter.toLocal()
    expect(local).toBeInstanceOf(Date)
  })

  it('toLocal retourne la date inchangée si timezone est local', () => {
    const date = new Date('2024-01-15T10:30:00')
    state.setSelectedDate(date)
    state.setTimezone('local')

    const local = formatter.toLocal()
    expect(local).toEqual(date)
  })
})
