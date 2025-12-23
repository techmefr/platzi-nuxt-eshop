import type { DataTableState } from '../state/DataTableState'

export class DataTableSorter<T = unknown> {
  constructor(protected state: DataTableState<T>) {}

  toggleSort(key: string) {
    const currentSort = this.state.getSort().value
    
    if (!currentSort || currentSort.key !== key) {
      this.state.setSort({ key, order: 'asc' })
    } else if (currentSort.order === 'asc') {
      this.state.setSort({ key, order: 'desc' })
    } else {
      this.state.setSort(null)
    }
  }

  setSort(key: string, order: 'asc' | 'desc') {
    this.state.setSort({ key, order })
  }

  clearSort() {
    this.state.setSort(null)
  }

  getSortedItems() {
    return computed(() => {
      const items = this.state.getItems().value
      const sort = this.state.getSort().value
      
      if (!sort) return items

      const sorted = [...items].sort((a, b) => {
        const aValue = this.getNestedValue(a, sort.key)
        const bValue = this.getNestedValue(b, sort.key)

        if (aValue === bValue) return 0

        const comparison = aValue > bValue ? 1 : -1
        return sort.order === 'asc' ? comparison : -comparison
      })

      return sorted
    })
  }

  protected getNestedValue(obj: unknown, path: string): unknown {
    return path.split('.').reduce((acc, part) => {
      if (acc && typeof acc === 'object' && part in acc) {
        return (acc as Record<string, unknown>)[part]
      }
      return undefined
    }, obj)
  }
}
