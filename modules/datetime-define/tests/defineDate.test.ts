import { describe, it, expect, beforeEach } from 'vitest'
import { defineDate } from '../defineDate'
import { clearDateTimeRegistry } from '../store/registry'

describe('defineDate', () => {
  beforeEach(() => {
    clearDateTimeRegistry()
  })

  it('cree une date avec les options par defaut', () => {
    const useBirthDate = defineDate('birthDate')
    const date = useBirthDate()

    expect(date.selectedDate.value).toBeNull()
    expect(date.format.value).toBe('yyyy-MM-dd')
    expect(date.timezone.value).toBe('local')
  })

  it('cree une date avec une valeur initiale', () => {
    const initialDate = new Date('2024-06-15')
    const useEventDate = defineDate('eventDate', { initialDate })
    const date = useEventDate()

    expect(date.selectedDate.value).toEqual(initialDate)
  })

  it('retourne la meme instance pour le meme id', () => {
    const useDate1 = defineDate('sameId')
    const useDate2 = defineDate('sameId')

    const date1 = useDate1()
    const date2 = useDate2()

    date1.setDate(new Date('2024-01-15'))

    expect(date2.selectedDate.value).toEqual(new Date('2024-01-15'))
  })

  describe('setDate', () => {
    it('definit une date valide', () => {
      const useDate = defineDate('setDateTest')
      const date = useDate()

      date.setDate(new Date('2024-06-15'))

      expect(date.selectedDate.value).toEqual(new Date('2024-06-15'))
      expect(date.isValid.value).toBe(true)
    })

    it('parse une date string', () => {
      const useDate = defineDate('parseTest')
      const date = useDate()

      date.setDate('2024-06-15')

      expect(date.selectedDate.value).not.toBeNull()
      expect(date.isValid.value).toBe(true)
    })

    it('setDate null reinitialise', () => {
      const useDate = defineDate('nullTest')
      const date = useDate()

      date.setDate(new Date('2024-06-15'))
      date.setDate(null)

      expect(date.selectedDate.value).toBeNull()
    })
  })

  describe('validation', () => {
    it('valide une date dans les limites', () => {
      const useDate = defineDate('validTest', {
        minDate: new Date('2024-01-01'),
        maxDate: new Date('2024-12-31'),
      })
      const date = useDate()

      date.setDate(new Date('2024-06-15'))

      expect(date.isValid.value).toBe(true)
      expect(date.error.value).toBeNull()
    })

    it('erreur si date avant minDate', () => {
      const useDate = defineDate('minTest', {
        minDate: new Date('2024-01-01'),
      })
      const date = useDate()

      date.setDate(new Date('2023-12-15'))

      expect(date.error.value?.type).toBe('min')
    })

    it('erreur si date apres maxDate', () => {
      const useDate = defineDate('maxTest', {
        maxDate: new Date('2024-12-31'),
      })
      const date = useDate()

      date.setDate(new Date('2025-01-15'))

      expect(date.error.value?.type).toBe('max')
    })

    it('autoCorrect corrige la date', () => {
      const minDate = new Date('2024-01-01')
      const useDate = defineDate('autoCorrectTest', {
        minDate,
        autoCorrect: true,
      })
      const date = useDate()

      date.setDate(new Date('2023-12-15'))

      expect(date.selectedDate.value).toEqual(minDate)
      expect(date.error.value).toBeNull()
    })
  })

  describe('formattedValue', () => {
    it('retourne null si pas de date', () => {
      const useDate = defineDate('formatNullTest')
      const date = useDate()

      expect(date.formattedValue.value).toBeNull()
    })

    it('formate avec le format par defaut', () => {
      const useDate = defineDate('formatDefaultTest')
      const date = useDate()

      date.setDate(new Date('2024-06-15'))

      expect(date.formattedValue.value).toBe('2024-06-15')
    })

    it('formate avec un format custom', () => {
      const useDate = defineDate('formatCustomTest', {
        format: 'dd/MM/yyyy',
      })
      const date = useDate()

      date.setDate(new Date('2024-06-15'))

      expect(date.formattedValue.value).toBe('15/06/2024')
    })
  })

  describe('isoValue', () => {
    it('retourne null si pas de date', () => {
      const useDate = defineDate('isoNullTest')
      const date = useDate()

      expect(date.isoValue.value).toBeNull()
    })

    it('retourne la valeur ISO', () => {
      const useDate = defineDate('isoTest')
      const date = useDate()

      date.setDate(new Date('2024-06-15'))

      expect(date.isoValue.value).toContain('2024-06-15')
    })
  })

  describe('reset et clear', () => {
    it('reset reinitialise la date', () => {
      const useDate = defineDate('resetTest')
      const date = useDate()

      date.setDate(new Date('2024-06-15'))
      date.reset()

      expect(date.selectedDate.value).toBeNull()
      expect(date.error.value).toBeNull()
    })

    it('clear reinitialise tout', () => {
      const useDate = defineDate('clearTest', {
        minDate: new Date('2024-01-01'),
        maxDate: new Date('2024-12-31'),
      })
      const date = useDate()

      date.setDate(new Date('2024-06-15'))
      date.clear()

      expect(date.selectedDate.value).toBeNull()
      expect(date.minDate.value).toBeNull()
      expect(date.maxDate.value).toBeNull()
    })
  })

  describe('setMinDate et setMaxDate', () => {
    it('setMinDate met a jour et revalide', () => {
      const useDate = defineDate('setMinTest')
      const date = useDate()

      date.setDate(new Date('2024-06-15'))
      date.setMinDate(new Date('2024-07-01'))

      expect(date.error.value?.type).toBe('min')
    })

    it('setMaxDate met a jour et revalide', () => {
      const useDate = defineDate('setMaxTest')
      const date = useDate()

      date.setDate(new Date('2024-06-15'))
      date.setMaxDate(new Date('2024-05-01'))

      expect(date.error.value?.type).toBe('max')
    })
  })
})
