import { describe, it, expect } from 'vitest'
import {
  defaultPayloadBuilder,
  lomkitPayloadBuilder,
  graphqlPayloadBuilder,
  createPayloadBuilder,
} from '../payloadBuilders'
import type { ServerFetchParams } from '../types'

describe('payloadBuilders', () => {
  const baseParams: ServerFetchParams = {
    page: 2,
    itemsPerPage: 20,
  }

  const fullParams: ServerFetchParams = {
    page: 1,
    itemsPerPage: 10,
    sortBy: 'name',
    sortOrder: 'desc',
    search: 'query',
    filters: { status: 'active' },
  }

  describe('defaultPayloadBuilder', () => {
    it('construit un payload de base', () => {
      const result = defaultPayloadBuilder(baseParams) as Record<string, unknown>

      expect(result.page).toBe(2)
      expect(result.per_page).toBe(20)
    })

    it('inclut le tri si present', () => {
      const result = defaultPayloadBuilder(fullParams) as Record<string, unknown>

      expect(result.sort_by).toBe('name')
      expect(result.sort_order).toBe('desc')
    })

    it('inclut la recherche si presente', () => {
      const result = defaultPayloadBuilder(fullParams) as Record<string, unknown>

      expect(result.search).toBe('query')
    })

    it('inclut les filtres si presents', () => {
      const result = defaultPayloadBuilder(fullParams) as Record<string, unknown>

      expect(result.filters).toEqual({ status: 'active' })
    })

    it('ignore les filtres vides', () => {
      const params: ServerFetchParams = { ...baseParams, filters: {} }
      const result = defaultPayloadBuilder(params) as Record<string, unknown>

      expect(result.filters).toBeUndefined()
    })
  })

  describe('lomkitPayloadBuilder', () => {
    it('construit un payload format Lomkit', () => {
      const result = lomkitPayloadBuilder(baseParams) as Record<string, unknown>

      expect(result.pagination).toEqual({ page: 2, limit: 20 })
    })

    it('inclut les sorts au format Lomkit', () => {
      const result = lomkitPayloadBuilder(fullParams) as Record<string, unknown>

      expect(result.sorts).toEqual([
        { field: 'name', direction: 'desc' },
      ])
    })

    it('inclut la recherche au format Lomkit', () => {
      const result = lomkitPayloadBuilder(fullParams) as Record<string, unknown>

      expect(result.search).toEqual({ query: 'query' })
    }
    )

    it('transforme les filtres au format Lomkit', () => {
      const result = lomkitPayloadBuilder(fullParams) as Record<string, unknown>

      expect(result.filters).toEqual([
        { field: 'status', operator: '=', value: 'active' },
      ])
    })
  })

  describe('graphqlPayloadBuilder', () => {
    it('construit un payload format GraphQL', () => {
      const result = graphqlPayloadBuilder(baseParams) as Record<string, unknown>

      expect(result.pagination).toEqual({ page: 2, limit: 20 })
    })

    it('inclut le sort au format GraphQL', () => {
      const result = graphqlPayloadBuilder(fullParams) as Record<string, unknown>

      expect(result.sort).toEqual({ field: 'name', order: 'DESC' })
    })

    it('inclut la recherche directement', () => {
      const result = graphqlPayloadBuilder(fullParams) as Record<string, unknown>

      expect(result.search).toBe('query')
    })

    it('inclut les filtres directement', () => {
      const result = graphqlPayloadBuilder(fullParams) as Record<string, unknown>

      expect(result.filters).toEqual({ status: 'active' })
    })
  })

  describe('createPayloadBuilder', () => {
    it('retourne une fonction de payload custom', () => {
      const customBuilder = createPayloadBuilder((params) => ({
        custom: true,
        p: params.page,
      }))

      const result = customBuilder(baseParams) as Record<string, unknown>

      expect(result.custom).toBe(true)
      expect(result.p).toBe(2)
    })
  })
})
