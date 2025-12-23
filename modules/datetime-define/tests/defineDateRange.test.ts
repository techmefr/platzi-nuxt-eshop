import { describe, it, expect, beforeEach } from 'vitest'
import { defineDateRange } from '../defineDateRange'
import { clearDateTimeRegistry } from '../store/registry'

describe('defineDateRange', () => {
  beforeEach(() => {
    clearDateTimeRegistry()
  })

  it('cree une plage avec les options par defaut', () => {
    const useBookingRange = defineDateRange('bookingRange')
    const range = useBookingRange()

    expect(range.startDate.value).toBeNull()
    expect(range.endDate.value).toBeNull()
    expect(range.format.value).toBe('yyyy-MM-dd')
  })

  it('cree une plage avec des valeurs initiales', () => {
    const start = new Date('2024-01-01')
    const end = new Date('2024-01-31')
    const useVacationRange = defineDateRange('vacationRange', {
      initialRange: { start, end },
    })
    const range = useVacationRange()

    expect(range.startDate.value).toEqual(start)
    expect(range.endDate.value).toEqual(end)
  })

  describe('setStartDate', () => {
    it('definit la date de debut', () => {
      const useRange = defineDateRange('startTest')
      const range = useRange()

      range.setStartDate(new Date('2024-06-01'))

      expect(range.startDate.value).toEqual(new Date('2024-06-01'))
    })
  })

  describe('setEndDate', () => {
    it('definit la date de fin', () => {
      const useRange = defineDateRange('endTest')
      const range = useRange()

      range.setEndDate(new Date('2024-06-30'))

      expect(range.endDate.value).toEqual(new Date('2024-06-30'))
    })
  })

  describe('setDateRange', () => {
    it('definit les deux dates', () => {
      const useRange = defineDateRange('bothTest')
      const range = useRange()

      range.setDateRange(new Date('2024-06-01'), new Date('2024-06-30'))

      expect(range.startDate.value).toEqual(new Date('2024-06-01'))
      expect(range.endDate.value).toEqual(new Date('2024-06-30'))
    })

    it('parse des strings', () => {
      const useRange = defineDateRange('parseTest')
      const range = useRange()

      range.setDateRange('2024-06-01', '2024-06-30')

      expect(range.startDate.value).not.toBeNull()
      expect(range.endDate.value).not.toBeNull()
    })
  })

  describe('dateRange', () => {
    it('retourne un objet avec start et end', () => {
      const useRange = defineDateRange('rangeObjectTest')
      const range = useRange()

      range.setDateRange(new Date('2024-06-01'), new Date('2024-06-30'))

      expect(range.dateRange.value.start).toEqual(new Date('2024-06-01'))
      expect(range.dateRange.value.end).toEqual(new Date('2024-06-30'))
    })
  })

  describe('isValid', () => {
    it('valide si les deux dates sont presentes et correctes', () => {
      const useRange = defineDateRange('validTest')
      const range = useRange()

      range.setDateRange(new Date('2024-06-01'), new Date('2024-06-30'))

      expect(range.isValid.value).toBe(true)
    })

    it('invalide si une seule date', () => {
      const useRange = defineDateRange('invalidSingleTest')
      const range = useRange()

      range.setStartDate(new Date('2024-06-01'))

      expect(range.isValid.value).toBe(false)
    })

    it('erreur si start apres end', () => {
      const useRange = defineDateRange('rangeErrorTest')
      const range = useRange()

      range.setDateRange(new Date('2024-06-30'), new Date('2024-06-01'))

      expect(range.error.value?.type).toBe('range')
    })
  })

  describe('validation avec min/max', () => {
    it('valide dans les limites', () => {
      const useRange = defineDateRange('limitsValidTest', {
        minDate: new Date('2024-01-01'),
        maxDate: new Date('2024-12-31'),
      })
      const range = useRange()

      range.setDateRange(new Date('2024-06-01'), new Date('2024-06-30'))

      expect(range.isValid.value).toBe(true)
    })

    it('erreur si start avant minDate', () => {
      const useRange = defineDateRange('minErrorTest', {
        minDate: new Date('2024-01-01'),
      })
      const range = useRange()

      range.setStartDate(new Date('2023-12-15'))

      expect(range.error.value?.type).toBe('min')
    })

    it('erreur si end apres maxDate', () => {
      const useRange = defineDateRange('maxErrorTest', {
        maxDate: new Date('2024-12-31'),
      })
      const range = useRange()

      range.setEndDate(new Date('2025-01-15'))

      expect(range.error.value?.type).toBe('max')
    })

    it('autoCorrect corrige les dates', () => {
      const minDate = new Date('2024-01-01')
      const maxDate = new Date('2024-12-31')
      const useRange = defineDateRange('autoCorrectTest', {
        minDate,
        maxDate,
        autoCorrect: true,
      })
      const range = useRange()

      range.setDateRange(new Date('2023-12-01'), new Date('2025-02-01'))

      expect(range.startDate.value).toEqual(minDate)
      expect(range.endDate.value).toEqual(maxDate)
    })
  })

  describe('formattedValue', () => {
    it('formate les deux dates', () => {
      const useRange = defineDateRange('formatTest', {
        format: 'dd/MM/yyyy',
      })
      const range = useRange()

      range.setDateRange(new Date('2024-06-01'), new Date('2024-06-30'))

      expect(range.formattedValue.value.start).toBe('01/06/2024')
      expect(range.formattedValue.value.end).toBe('30/06/2024')
    })
  })

  describe('isoValue', () => {
    it('retourne les valeurs ISO', () => {
      const useRange = defineDateRange('isoTest')
      const range = useRange()

      range.setDateRange(new Date('2024-06-01'), new Date('2024-06-30'))

      expect(range.isoValue.value.start).toContain('2024-06-01')
      expect(range.isoValue.value.end).toContain('2024-06-30')
    })
  })

  describe('reset et clear', () => {
    it('reset reinitialise les dates', () => {
      const useRange = defineDateRange('resetTest')
      const range = useRange()

      range.setDateRange(new Date('2024-06-01'), new Date('2024-06-30'))
      range.reset()

      expect(range.startDate.value).toBeNull()
      expect(range.endDate.value).toBeNull()
    })

    it('clear reinitialise tout', () => {
      const useRange = defineDateRange('clearTest', {
        minDate: new Date('2024-01-01'),
      })
      const range = useRange()

      range.setDateRange(new Date('2024-06-01'), new Date('2024-06-30'))
      range.clear()

      expect(range.startDate.value).toBeNull()
      expect(range.minDate.value).toBeNull()
    })
  })
})
