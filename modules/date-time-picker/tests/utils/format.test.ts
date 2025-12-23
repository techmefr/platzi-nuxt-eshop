import { describe, it, expect } from 'vitest'
import { formatDate, parseDate, toISO, combineDateTime, extractTime } from '../../utils/format'

describe('utils/format', () => {
  describe('formatDate', () => {
    it('formate une date avec le format par défaut', () => {
      const date = new Date('2024-01-15')
      expect(formatDate(date)).toBe('2024-01-15')
    })

    it('formate une date avec un format personnalisé', () => {
      const date = new Date('2024-01-15')
      expect(formatDate(date, 'dd/MM/yyyy')).toBe('15/01/2024')
    })
  })

  describe('parseDate', () => {
    it('parse une date ISO valide', () => {
      const parsed = parseDate('2024-01-15')
      expect(parsed).toBeInstanceOf(Date)
      expect(parsed?.getFullYear()).toBe(2024)
    })

    it('retourne null pour une date invalide', () => {
      expect(parseDate('invalid-date')).toBeNull()
    })
  })

  describe('toISO', () => {
    it('convertit une date en ISO', () => {
      const date = new Date('2024-01-15T10:30:00')
      const iso = toISO(date)
      expect(iso).toContain('2024-01-15')
    })
  })

  describe('combineDateTime', () => {
    it('combine date et heure correctement', () => {
      const date = new Date('2024-01-15')
      const combined = combineDateTime(date, '14:30')
      
      expect(combined).toBeInstanceOf(Date)
      expect(combined?.getHours()).toBe(14)
      expect(combined?.getMinutes()).toBe(30)
    })

    it('retourne null pour une heure invalide', () => {
      const date = new Date('2024-01-15')
      expect(combineDateTime(date, 'invalid')).toBeNull()
    })
  })

  describe('extractTime', () => {
    it('extrait l\'heure d\'une date', () => {
      const date = new Date('2024-01-15T14:30:00')
      expect(extractTime(date)).toBe('14:30')
    })

    it('pad les heures et minutes avec des zéros', () => {
      const date = new Date('2024-01-15T09:05:00')
      expect(extractTime(date)).toBe('09:05')
    })
  })
})
