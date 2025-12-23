import { describe, it, expect } from 'vitest'
import {
  isValidDate,
  isDateInRange,
  isRangeValid,
  validateDateTime,
  validateRange,
  correctDate
} from '../../utils/validation'

describe('utils/validation', () => {
  describe('isValidDate', () => {
    it('retourne true pour une date valide', () => {
      expect(isValidDate(new Date('2024-01-15'))).toBe(true)
    })

    it('retourne false pour null', () => {
      expect(isValidDate(null)).toBe(false)
    })

    it('retourne false pour une date invalide', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false)
    })
  })

  describe('isDateInRange', () => {
    it('retourne true si la date est dans la plage', () => {
      const date = new Date('2024-06-15')
      const min = new Date('2024-01-01')
      const max = new Date('2024-12-31')
      
      expect(isDateInRange(date, min, max)).toBe(true)
    })

    it('retourne false si la date est avant le minimum', () => {
      const date = new Date('2023-12-15')
      const min = new Date('2024-01-01')
      
      expect(isDateInRange(date, min, null)).toBe(false)
    })

    it('retourne false si la date est après le maximum', () => {
      const date = new Date('2025-01-15')
      const max = new Date('2024-12-31')
      
      expect(isDateInRange(date, null, max)).toBe(false)
    })
  })

  describe('isRangeValid', () => {
    it('retourne true si start est avant end', () => {
      const start = new Date('2024-01-01')
      const end = new Date('2024-12-31')
      
      expect(isRangeValid(start, end)).toBe(true)
    })

    it('retourne true si start égale end', () => {
      const date = new Date('2024-01-15')
      
      expect(isRangeValid(date, date)).toBe(true)
    })

    it('retourne false si start est après end', () => {
      const start = new Date('2024-12-31')
      const end = new Date('2024-01-01')
      
      expect(isRangeValid(start, end)).toBe(false)
    })
  })

  describe('validateDateTime', () => {
    it('retourne null pour une date valide', () => {
      const date = new Date('2024-06-15')
      const min = new Date('2024-01-01')
      const max = new Date('2024-12-31')
      
      expect(validateDateTime(date, min, max)).toBeNull()
    })

    it('retourne une erreur de type "min"', () => {
      const date = new Date('2023-12-15')
      const min = new Date('2024-01-01')
      
      const error = validateDateTime(date, min, null)
      expect(error?.type).toBe('min')
    })

    it('retourne une erreur de type "max"', () => {
      const date = new Date('2025-01-15')
      const max = new Date('2024-12-31')
      
      const error = validateDateTime(date, null, max)
      expect(error?.type).toBe('max')
    })
  })

  describe('validateRange', () => {
    it('retourne null pour une plage valide', () => {
      const start = new Date('2024-01-01')
      const end = new Date('2024-12-31')
      
      expect(validateRange(start, end, null, null)).toBeNull()
    })

    it('retourne une erreur si la plage est invalide', () => {
      const start = new Date('2024-12-31')
      const end = new Date('2024-01-01')
      
      const error = validateRange(start, end, null, null)
      expect(error?.type).toBe('range')
    })
  })

  describe('correctDate', () => {
    it('retourne la date min si la date est avant', () => {
      const date = new Date('2023-12-15')
      const min = new Date('2024-01-01')
      
      expect(correctDate(date, min, null)).toEqual(min)
    })

    it('retourne la date max si la date est après', () => {
      const date = new Date('2025-01-15')
      const max = new Date('2024-12-31')
      
      expect(correctDate(date, null, max)).toEqual(max)
    })

    it('retourne la date inchangée si elle est dans la plage', () => {
      const date = new Date('2024-06-15')
      const min = new Date('2024-01-01')
      const max = new Date('2024-12-31')
      
      expect(correctDate(date, min, max)).toEqual(date)
    })
  })
})
