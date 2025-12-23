import { describe, it, expect, beforeEach } from 'vitest'
import { defineDataTable } from '../defineDataTable'
import { clearDataTableRegistry } from '../store/registry'

interface User {
  id: number
  name: string
  email: string
  age: number
}

const mockUsers: User[] = [
  { id: 1, name: 'Alice', email: 'alice@test.com', age: 25 },
  { id: 2, name: 'Bob', email: 'bob@test.com', age: 30 },
  { id: 3, name: 'Charlie', email: 'charlie@test.com', age: 35 },
  { id: 4, name: 'Diana', email: 'diana@test.com', age: 28 },
  { id: 5, name: 'Eve', email: 'eve@test.com', age: 22 },
]

describe('defineDataTable', () => {
  beforeEach(() => {
    clearDataTableRegistry()
  })

  it('cree une table avec les options par defaut', () => {
    const useUsersTable = defineDataTable<User>('users')
    const table = useUsersTable()

    expect(table.items.value).toEqual([])
    expect(table.pagination.value.page).toBe(1)
    expect(table.pagination.value.itemsPerPage).toBe(10)
  })

  it('cree une table avec des items initiaux', () => {
    const useUsersTable = defineDataTable<User>('usersWithItems', {
      items: mockUsers,
    })
    const table = useUsersTable()

    expect(table.items.value).toHaveLength(5)
    expect(table.pagination.value.totalItems).toBe(5)
  })

  it('retourne la meme instance pour le meme id', () => {
    const useTable1 = defineDataTable<User>('sameId')
    const useTable2 = defineDataTable<User>('sameId')

    const table1 = useTable1()
    const table2 = useTable2()

    table1.setItems(mockUsers)

    expect(table2.items.value).toHaveLength(5)
  })

  describe('setItems', () => {
    it('met a jour les items et la pagination', () => {
      const useTable = defineDataTable<User>('setItemsTest')
      const table = useTable()

      table.setItems(mockUsers)

      expect(table.items.value).toHaveLength(5)
      expect(table.pagination.value.totalItems).toBe(5)
    })
  })

  describe('tri', () => {
    it('toggleSort alterne entre asc, desc et null', () => {
      const useTable = defineDataTable<User>('sortTest', { items: mockUsers })
      const table = useTable()

      table.toggleSort('name')
      expect(table.sort.value).toEqual({ key: 'name', order: 'asc' })

      table.toggleSort('name')
      expect(table.sort.value).toEqual({ key: 'name', order: 'desc' })

      table.toggleSort('name')
      expect(table.sort.value).toBeNull()
    })

    it('setSort definit le tri', () => {
      const useTable = defineDataTable<User>('setSortTest', { items: mockUsers })
      const table = useTable()

      table.setSort('age', 'desc')
      expect(table.sort.value).toEqual({ key: 'age', order: 'desc' })
    })

    it('sortedItems retourne les items tries', () => {
      const useTable = defineDataTable<User>('sortedItemsTest', { items: mockUsers })
      const table = useTable()

      table.setSort('age', 'asc')
      expect(table.sortedItems.value[0].age).toBe(22)

      table.setSort('age', 'desc')
      expect(table.sortedItems.value[0].age).toBe(35)
    })

    it('clearSort supprime le tri', () => {
      const useTable = defineDataTable<User>('clearSortTest', { items: mockUsers })
      const table = useTable()

      table.setSort('name', 'asc')
      table.clearSort()

      expect(table.sort.value).toBeNull()
    })
  })

  describe('pagination', () => {
    it('paginatedItems retourne les items de la page courante', () => {
      const useTable = defineDataTable<User>('paginationTest', {
        items: mockUsers,
        itemsPerPage: 2,
      })
      const table = useTable()

      expect(table.paginatedItems.value).toHaveLength(2)
      expect(table.paginatedItems.value[0].id).toBe(1)
    })

    it('setPage change la page', () => {
      const useTable = defineDataTable<User>('setPageTest', {
        items: mockUsers,
        itemsPerPage: 2,
      })
      const table = useTable()

      table.setPage(2)
      expect(table.pagination.value.page).toBe(2)
      expect(table.paginatedItems.value[0].id).toBe(3)
    })

    it('nextPage et previousPage naviguent', () => {
      const useTable = defineDataTable<User>('navTest', {
        items: mockUsers,
        itemsPerPage: 2,
      })
      const table = useTable()

      table.nextPage()
      expect(table.pagination.value.page).toBe(2)

      table.previousPage()
      expect(table.pagination.value.page).toBe(1)
    })

    it('goToFirstPage et goToLastPage', () => {
      const useTable = defineDataTable<User>('firstLastTest', {
        items: mockUsers,
        itemsPerPage: 2,
      })
      const table = useTable()

      table.goToLastPage()
      expect(table.pagination.value.page).toBe(3)

      table.goToFirstPage()
      expect(table.pagination.value.page).toBe(1)
    })

    it('setItemsPerPage change le nombre par page', () => {
      const useTable = defineDataTable<User>('itemsPerPageTest', {
        items: mockUsers,
        itemsPerPage: 2,
      })
      const table = useTable()

      table.setItemsPerPage(5)
      expect(table.pagination.value.itemsPerPage).toBe(5)
      expect(table.paginatedItems.value).toHaveLength(5)
    })
  })

  describe('selection', () => {
    it('selectItem toggle la selection', () => {
      const useTable = defineDataTable<User>('selectTest', { items: mockUsers })
      const table = useTable()

      table.selectItem(mockUsers[0])
      expect(table.selectedItems.value).toHaveLength(1)

      table.selectItem(mockUsers[0])
      expect(table.selectedItems.value).toHaveLength(0)
    })

    it('selectAll selectionne tous les items', () => {
      const useTable = defineDataTable<User>('selectAllTest', { items: mockUsers })
      const table = useTable()

      table.selectAll()
      expect(table.selectedItems.value).toHaveLength(5)
      expect(table.isAllSelected.value).toBe(true)

      table.selectAll()
      expect(table.selectedItems.value).toHaveLength(0)
    })

    it('clearSelection vide la selection', () => {
      const useTable = defineDataTable<User>('clearSelectionTest', { items: mockUsers })
      const table = useTable()

      table.selectAll()
      table.clearSelection()

      expect(table.selectedItems.value).toHaveLength(0)
    })

    it('isSelected verifie si un item est selectionne', () => {
      const useTable = defineDataTable<User>('isSelectedTest', { items: mockUsers })
      const table = useTable()

      table.selectItem(mockUsers[0])

      expect(table.isSelected(mockUsers[0])).toBe(true)
      expect(table.isSelected(mockUsers[1])).toBe(false)
    })

    it('selectedCount retourne le nombre de selectionnes', () => {
      const useTable = defineDataTable<User>('selectedCountTest', { items: mockUsers })
      const table = useTable()

      table.selectItems([mockUsers[0], mockUsers[1]])

      expect(table.selectedCount.value).toBe(2)
    })

    it('isIndeterminate est true si selection partielle', () => {
      const useTable = defineDataTable<User>('indeterminateTest', { items: mockUsers })
      const table = useTable()

      table.selectItem(mockUsers[0])

      expect(table.isIndeterminate.value).toBe(true)
      expect(table.isAllSelected.value).toBe(false)
    })
  })

  describe('reset', () => {
    it('reset reinitialise la table', () => {
      const useTable = defineDataTable<User>('resetTest', { items: mockUsers })
      const table = useTable()

      table.setSort('name', 'asc')
      table.setPage(2)
      table.selectAll()
      table.reset()

      expect(table.items.value).toHaveLength(0)
      expect(table.sort.value).toBeNull()
      expect(table.pagination.value.page).toBe(1)
      expect(table.selectedItems.value).toHaveLength(0)
    })
  })
})
