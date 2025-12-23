import { describe, it, expect, beforeEach, vi } from 'vitest'
import { defineServerDataTable } from '../defineServerDataTable'
import { clearDataTableRegistry } from '../store/registry'

interface Product {
  id: number
  name: string
  price: number
}

const mockProducts: Product[] = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Phone', price: 699 },
  { id: 3, name: 'Tablet', price: 499 },
]

const createMockFetchFn = (products: Product[] = mockProducts) => {
  return vi.fn().mockResolvedValue({
    items: products,
    total: products.length,
  })
}

describe('defineServerDataTable', () => {
  beforeEach(() => {
    clearDataTableRegistry()
    vi.clearAllMocks()
  })

  it('cree une table serveur et fetch automatiquement', async () => {
    const fetchFn = createMockFetchFn()
    const useProductsTable = defineServerDataTable<Product>('products', {
      fetchFn,
    })
    const table = useProductsTable()

    await vi.waitFor(() => {
      expect(table.items.value).toHaveLength(3)
    })

    expect(fetchFn).toHaveBeenCalledTimes(1)
  })

  it('autoFetch false ne fetch pas automatiquement', async () => {
    const fetchFn = createMockFetchFn()
    const useTable = defineServerDataTable<Product>('noAutoFetch', {
      fetchFn,
      autoFetch: false,
    })
    const table = useTable()

    expect(fetchFn).not.toHaveBeenCalled()
    expect(table.items.value).toHaveLength(0)
  })

  it('fetchItems appelle la fonction fetch', async () => {
    const fetchFn = createMockFetchFn()
    const useTable = defineServerDataTable<Product>('fetchTest', {
      fetchFn,
      autoFetch: false,
    })
    const table = useTable()

    await table.fetchItems()

    expect(fetchFn).toHaveBeenCalledTimes(1)
    expect(table.items.value).toHaveLength(3)
  })

  it('passe les bons parametres au payload builder', async () => {
    const fetchFn = createMockFetchFn()
    const useTable = defineServerDataTable<Product>('paramsTest', {
      fetchFn,
      autoFetch: false,
      itemsPerPage: 20,
    })
    const table = useTable()

    await table.fetchItems()

    expect(fetchFn).toHaveBeenCalledWith({
      page: 1,
      per_page: 20,
    })
  })

  describe('pagination serveur', () => {
    it('setPage refetch avec la nouvelle page', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        items: mockProducts,
        total: 100,
      })
      const useTable = defineServerDataTable<Product>('serverPageTest', {
        fetchFn,
        autoFetch: false,
      })
      const table = useTable()

      await table.fetchItems()
      await table.setPage(2)

      expect(fetchFn).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2 })
      )
    })

    it('setItemsPerPage refetch avec le nouveau nombre', async () => {
      const fetchFn = createMockFetchFn()
      const useTable = defineServerDataTable<Product>('serverItemsPerPageTest', {
        fetchFn,
        autoFetch: false,
      })
      const table = useTable()

      await table.setItemsPerPage(50)

      expect(fetchFn).toHaveBeenCalledWith(
        expect.objectContaining({ per_page: 50 })
      )
    })
  })

  describe('tri serveur', () => {
    it('toggleSort refetch avec le tri', async () => {
      const fetchFn = createMockFetchFn()
      const useTable = defineServerDataTable<Product>('serverSortTest', {
        fetchFn,
        autoFetch: false,
      })
      const table = useTable()

      await table.toggleSort('price')

      expect(fetchFn).toHaveBeenCalledWith(
        expect.objectContaining({
          sort_by: 'price',
          sort_order: 'asc',
        })
      )
    })

    it('setSort refetch avec le tri specifie', async () => {
      const fetchFn = createMockFetchFn()
      const useTable = defineServerDataTable<Product>('serverSetSortTest', {
        fetchFn,
        autoFetch: false,
      })
      const table = useTable()

      await table.setSort('name', 'desc')

      expect(fetchFn).toHaveBeenCalledWith(
        expect.objectContaining({
          sort_by: 'name',
          sort_order: 'desc',
        })
      )
    })
  })

  describe('recherche', () => {
    it('setSearch avec immediate refetch immediatement', async () => {
      const fetchFn = createMockFetchFn()
      const useTable = defineServerDataTable<Product>('searchTest', {
        fetchFn,
        autoFetch: false,
      })
      const table = useTable()

      table.setSearch('laptop', true)

      await vi.waitFor(() => {
        expect(fetchFn).toHaveBeenCalledWith(
          expect.objectContaining({ search: 'laptop' })
        )
      })
    })

    it('clearSearch vide la recherche', async () => {
      const fetchFn = createMockFetchFn()
      const useTable = defineServerDataTable<Product>('clearSearchTest', {
        fetchFn,
        autoFetch: false,
      })
      const table = useTable()

      table.setSearch('test', true)
      table.clearSearch()

      expect(table.search.value).toBe('')
    })
  })

  describe('filtres', () => {
    it('setFilter ajoute un filtre et refetch', async () => {
      const fetchFn = createMockFetchFn()
      const useTable = defineServerDataTable<Product>('filterTest', {
        fetchFn,
        autoFetch: false,
      })
      const table = useTable()

      table.setFilter('category', 'electronics')

      await vi.waitFor(() => {
        expect(fetchFn).toHaveBeenCalledWith(
          expect.objectContaining({
            filters: { category: 'electronics' },
          })
        )
      })
    })

    it('setFilters remplace tous les filtres', async () => {
      const fetchFn = createMockFetchFn()
      const useTable = defineServerDataTable<Product>('setFiltersTest', {
        fetchFn,
        autoFetch: false,
      })
      const table = useTable()

      table.setFilters({ brand: 'Apple', inStock: true })

      await vi.waitFor(() => {
        expect(table.filters.value).toEqual({ brand: 'Apple', inStock: true })
      })
    })

    it('clearFilters vide les filtres', async () => {
      const fetchFn = createMockFetchFn()
      const useTable = defineServerDataTable<Product>('clearFiltersTest', {
        fetchFn,
        autoFetch: false,
      })
      const table = useTable()

      table.setFilter('test', 'value')
      table.clearFilters()

      expect(table.filters.value).toEqual({})
    })
  })

  describe('selection', () => {
    it('selectItem toggle la selection', async () => {
      const fetchFn = createMockFetchFn()
      const useTable = defineServerDataTable<Product>('serverSelectTest', {
        fetchFn,
        autoFetch: false,
      })
      const table = useTable()

      await table.fetchItems()
      table.selectItem(mockProducts[0])

      expect(table.selectedItems.value).toHaveLength(1)
      expect(table.selectedCount.value).toBe(1)
    })
  })

  describe('refresh', () => {
    it('refresh refetch les donnees', async () => {
      const fetchFn = createMockFetchFn()
      const useTable = defineServerDataTable<Product>('refreshTest', {
        fetchFn,
        autoFetch: false,
      })
      const table = useTable()

      await table.refresh()
      await table.refresh()

      expect(fetchFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('reset', () => {
    it('reset reinitialise la table', async () => {
      const fetchFn = createMockFetchFn()
      const useTable = defineServerDataTable<Product>('serverResetTest', {
        fetchFn,
        autoFetch: false,
      })
      const table = useTable()

      await table.fetchItems()
      table.setSearch('test', true)
      table.setFilter('key', 'value')
      table.reset()

      expect(table.items.value).toHaveLength(0)
      expect(table.search.value).toBe('')
      expect(table.filters.value).toEqual({})
      expect(table.lastUpdate.value).toBeNull()
    })
  })

  describe('lastUpdate', () => {
    it('lastUpdate est mis a jour apres fetch', async () => {
      const fetchFn = createMockFetchFn()
      const useTable = defineServerDataTable<Product>('lastUpdateTest', {
        fetchFn,
        autoFetch: false,
      })
      const table = useTable()

      expect(table.lastUpdate.value).toBeNull()

      await table.fetchItems()

      expect(table.lastUpdate.value).toBeInstanceOf(Date)
    })
  })
})
