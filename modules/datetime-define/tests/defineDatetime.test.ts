import { describe, it, expect, beforeEach } from 'vitest'
import { defineDatetime } from '../defineDatetime'
import { clearDateTimeRegistry } from '../store/registry'

describe('defineDatetime', () => {
  beforeEach(() => {
    clearDateTimeRegistry()
  })

  it('cree un datetime avec les options par defaut', () => {
    const useEventDateTime = defineDatetime('eventDateTime')
    const dt = useEventDateTime()

    expect(dt.selectedDate.value).toBeNull()
    expect(dt.selectedTime.value).toBeNull()
    expect(dt.format.value).toBe('yyyy-MM-dd HH:mm')
  })

  it('cree un datetime avec des valeurs initiales', () => {
    const initialDate = new Date('2024-06-15')
    const useMeetingTime = defineDatetime('meetingTime', {
      initialDate,
      initialTime: '14:30',
    })
    const dt = useMeetingTime()

    expect(dt.selectedDate.value).toEqual(initialDate)
    expect(dt.selectedTime.value).toBe('14:30')
  })

  describe('setDate', () => {
    it('definit une date et extrait le temps', () => {
      const useDt = defineDatetime('setDateTest')
      const dt = useDt()

      dt.setDate(new Date('2024-06-15T10:30:00'))

      expect(dt.selectedDate.value).not.toBeNull()
      expect(dt.selectedTime.value).toBe('10:30')
    })
  })

  describe('setTime', () => {
    it('definit le temps', () => {
      const useDt = defineDatetime('setTimeTest')
      const dt = useDt()

      dt.setDate(new Date('2024-06-15'))
      dt.setTime('15:45')

      expect(dt.selectedTime.value).toBe('15:45')
    })
  })

  describe('setDateTime', () => {
    it('definit date et temps ensemble', () => {
      const useDt = defineDatetime('setDateTimeTest')
      const dt = useDt()

      dt.setDateTime(new Date('2024-06-15'), '16:00')

      expect(dt.selectedDate.value).not.toBeNull()
      expect(dt.selectedTime.value).toBe('16:00')
    })
  })

  describe('combinedDateTime', () => {
    it('combine date et temps', () => {
      const useDt = defineDatetime('combinedTest')
      const dt = useDt()

      dt.setDate(new Date('2024-06-15'))
      dt.setTime('14:30')

      const combined = dt.combinedDateTime.value
      expect(combined?.getHours()).toBe(14)
      expect(combined?.getMinutes()).toBe(30)
    })

    it('retourne la date seule si pas de temps', () => {
      const useDt = defineDatetime('noCombinedTest')
      const dt = useDt()

      dt.setDate(new Date('2024-06-15'))

      expect(dt.combinedDateTime.value).not.toBeNull()
    })
  })

  describe('formattedValue', () => {
    it('formate date et temps', () => {
      const useDt = defineDatetime('formatTest', {
        format: 'dd/MM/yyyy HH:mm',
      })
      const dt = useDt()

      dt.setDate(new Date('2024-06-15'))
      dt.setTime('14:30')

      expect(dt.formattedValue.value).toBe('15/06/2024 14:30')
    })
  })

  describe('validation', () => {
    it('valide dans les limites', () => {
      const useDt = defineDatetime('validTest', {
        minDate: new Date('2024-01-01'),
        maxDate: new Date('2024-12-31'),
      })
      const dt = useDt()

      dt.setDate(new Date('2024-06-15'))

      expect(dt.isValid.value).toBe(true)
    })

    it('erreur si hors limites', () => {
      const useDt = defineDatetime('invalidTest', {
        minDate: new Date('2024-01-01'),
      })
      const dt = useDt()

      dt.setDate(new Date('2023-12-15'))

      expect(dt.error.value?.type).toBe('min')
    })

    it('autoCorrect corrige la date', () => {
      const minDate = new Date('2024-01-01')
      const useDt = defineDatetime('autoCorrectTest', {
        minDate,
        autoCorrect: true,
      })
      const dt = useDt()

      dt.setDate(new Date('2023-12-15'))

      expect(dt.selectedDate.value).toEqual(minDate)
    })
  })

  describe('reset et clear', () => {
    it('reset reinitialise date et temps', () => {
      const useDt = defineDatetime('resetTest')
      const dt = useDt()

      dt.setDateTime(new Date('2024-06-15'), '14:30')
      dt.reset()

      expect(dt.selectedDate.value).toBeNull()
      expect(dt.selectedTime.value).toBeNull()
    })

    it('clear reinitialise tout', () => {
      const useDt = defineDatetime('clearTest', {
        minDate: new Date('2024-01-01'),
      })
      const dt = useDt()

      dt.setDate(new Date('2024-06-15'))
      dt.clear()

      expect(dt.selectedDate.value).toBeNull()
      expect(dt.minDate.value).toBeNull()
    })
  })
})
