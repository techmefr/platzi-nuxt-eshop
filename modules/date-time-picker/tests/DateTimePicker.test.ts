import { describe, it, expect, beforeEach } from 'vitest'
import { DateTimePicker } from '../DateTimePicker'

describe('DateTimePicker', () => {
  let picker: DateTimePicker

  beforeEach(() => {
    picker = new DateTimePicker()
  })

  it('initialise avec les valeurs par défaut', () => {
    expect(picker.getMode().value).toBe('single')
    expect(picker.getDateTimeMode().value).toBe('date')
    expect(picker.getSelectedDate().value).toBeNull()
  })

  it('définit une date correctement', () => {
    const date = new Date('2024-01-15')
    picker.setDate(date)
    
    expect(picker.getSelectedDate().value).toEqual(date)
    expect(picker.isValid().value).toBe(true)
  })

  it('parse une date string', () => {
    picker.setDate('2024-01-15')
    
    expect(picker.getSelectedDate().value).not.toBeNull()
    expect(picker.isValid().value).toBe(true)
  })

  it('valide les dates min et max', () => {
    const minDate = new Date('2024-01-01')
    const maxDate = new Date('2024-12-31')
    
    picker.setMinDate(minDate)
    picker.setMaxDate(maxDate)
    picker.setDate(new Date('2023-12-15'))
    
    expect(picker.isValid().value).toBe(false)
    expect(picker.getError().value?.type).toBe('min')
  })

  it('auto-corrige les dates hors limites', () => {
    const minDate = new Date('2024-01-01')
    const maxDate = new Date('2024-12-31')
    
    const pickerWithAutoCorrect = new DateTimePicker({ 
      autoCorrect: true,
      minDate,
      maxDate 
    })
    
    pickerWithAutoCorrect.setDate(new Date('2023-12-15'))
    
    expect(pickerWithAutoCorrect.getSelectedDate().value).toEqual(minDate)
    expect(pickerWithAutoCorrect.isValid().value).toBe(true)
  })

  it('gère le mode range', () => {
    const rangePicker = new DateTimePicker({ mode: 'range' })
    
    rangePicker.setDateRange('2024-01-01', '2024-01-31')
    
    expect(rangePicker.getDateRange().value.start).not.toBeNull()
    expect(rangePicker.getDateRange().value.end).not.toBeNull()
    expect(rangePicker.isValid().value).toBe(true)
  })

  it('reset réinitialise les valeurs', () => {
    picker.setDate('2024-01-15')
    picker.reset()
    
    expect(picker.getSelectedDate().value).toBeNull()
    expect(picker.getError().value).toBeNull()
  })

  it('retourne la valeur formatée', () => {
    picker.setDate('2024-01-15')
    
    expect(picker.getFormattedValue().value).toBe('2024-01-15')
  })

  it('retourne la valeur ISO', () => {
    const date = new Date('2024-01-15T10:30:00')
    picker.setDate(date)
    
    const isoValue = picker.getISOValue().value
    expect(isoValue).toContain('2024-01-15')
  })
})
