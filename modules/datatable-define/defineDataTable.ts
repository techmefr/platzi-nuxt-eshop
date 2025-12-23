import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { registerDataTable } from './store/registry'
import type {
  DataTableOptions,
  DataTableHeader,
  DataTableSort,
  DataTablePagination,
} from './types'

interface DataTableReturn<T> {
  items: ComputedRef<T[]>
  headers: ComputedRef<DataTableHeader[]>
  sort: ComputedRef<DataTableSort | null>
  pagination: ComputedRef<DataTablePagination>
  selectedItems: ComputedRef<T[]>
  isLoading: ComputedRef<boolean>
  sortedItems: ComputedRef<T[]>
  paginatedItems: ComputedRef<T[]>
  isAllSelected: ComputedRef<boolean>
  isPageSelected: ComputedRef<boolean>
  isIndeterminate: ComputedRef<boolean>
  selectedCount: ComputedRef<number>
  selectedIds: ComputedRef<(string | number)[]>
  setItems: (items: T[]) => void
  setHeaders: (headers: DataTableHeader[]) => void
  toggleSort: (key: string) => void
  setSort: (key: string, order: 'asc' | 'desc') => void
  clearSort: () => void
  setPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  goToFirstPage: () => void
  goToLastPage: () => void
  setItemsPerPage: (itemsPerPage: number) => void
  selectItem: (item: T) => void
  selectItems: (items: T[]) => void
  deselectItems: (items: T[]) => void
  selectAll: () => void
  selectPage: () => void
  clearSelection: () => void
  isSelected: (item: T) => boolean
  setLoading: (loading: boolean) => void
  reset: () => void
}

function createDataTable<T>(options: DataTableOptions<T> = {}): DataTableReturn<T> {
  const itemKey = options.itemKey || 'id'

  const items: Ref<T[]> = ref(options.items || []) as Ref<T[]>
  const headers: Ref<DataTableHeader[]> = ref(options.headers || [])
  const sort: Ref<DataTableSort | null> = ref(
    options.sortBy ? { key: options.sortBy, order: options.sortOrder || 'asc' } : null
  )
  const pagination: Ref<DataTablePagination> = ref({
    page: 1,
    itemsPerPage: options.itemsPerPage || 10,
    totalItems: options.items?.length || 0,
    totalPages: Math.ceil((options.items?.length || 0) / (options.itemsPerPage || 10)) || 1,
  })
  const selectedItems: Ref<T[]> = ref([]) as Ref<T[]>
  const isLoading = ref(false)

  const getItemId = (item: T): string | number => {
    if (typeof itemKey === 'function') {
      return itemKey(item)
    }
    return (item as Record<string, unknown>)[itemKey] as string | number
  }

  const updatePagination = () => {
    const total = items.value.length
    pagination.value = {
      ...pagination.value,
      totalItems: total,
      totalPages: Math.ceil(total / pagination.value.itemsPerPage) || 1,
    }
  }

  const getNestedValue = (obj: unknown, path: string): unknown => {
    return path.split('.').reduce((acc, part) => {
      if (acc && typeof acc === 'object' && part in acc) {
        return (acc as Record<string, unknown>)[part]
      }
      return undefined
    }, obj)
  }

  const sortedItems = computed(() => {
    const currentSort = sort.value
    if (!currentSort) return items.value

    return [...items.value].sort((a, b) => {
      const aValue = getNestedValue(a, currentSort.key)
      const bValue = getNestedValue(b, currentSort.key)

      if (aValue === bValue) return 0

      const comparison = (aValue as string | number) > (bValue as string | number) ? 1 : -1
      return currentSort.order === 'asc' ? comparison : -comparison
    })
  })

  const paginatedItems = computed(() => {
    const { page, itemsPerPage } = pagination.value
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    return sortedItems.value.slice(start, end)
  })

  const selectedIds = computed(() => selectedItems.value.map(item => getItemId(item)))

  const isAllSelected = computed(() => {
    return items.value.length > 0 && selectedItems.value.length === items.value.length
  })

  const isPageSelected = computed(() => {
    const pageItems = paginatedItems.value
    const ids = new Set(selectedIds.value)
    return pageItems.length > 0 && pageItems.every(item => ids.has(getItemId(item)))
  })

  const isIndeterminate = computed(() => {
    return selectedItems.value.length > 0 && selectedItems.value.length < items.value.length
  })

  const selectedCount = computed(() => selectedItems.value.length)

  const setItems = (newItems: T[]) => {
    items.value = newItems
    updatePagination()
  }

  const setHeaders = (newHeaders: DataTableHeader[]) => {
    headers.value = newHeaders
  }

  const toggleSort = (key: string) => {
    const currentSort = sort.value
    if (!currentSort || currentSort.key !== key) {
      sort.value = { key, order: 'asc' }
    } else if (currentSort.order === 'asc') {
      sort.value = { key, order: 'desc' }
    } else {
      sort.value = null
    }
  }

  const setSort = (key: string, order: 'asc' | 'desc') => {
    sort.value = { key, order }
  }

  const clearSort = () => {
    sort.value = null
  }

  const setPage = (page: number) => {
    const maxPage = pagination.value.totalPages || 1
    const newPage = Math.max(1, Math.min(page, maxPage))
    pagination.value = { ...pagination.value, page: newPage }
  }

  const nextPage = () => {
    if (pagination.value.page < pagination.value.totalPages) {
      setPage(pagination.value.page + 1)
    }
  }

  const previousPage = () => {
    if (pagination.value.page > 1) {
      setPage(pagination.value.page - 1)
    }
  }

  const goToFirstPage = () => setPage(1)

  const goToLastPage = () => setPage(pagination.value.totalPages)

  const setItemsPerPage = (itemsPerPage: number) => {
    pagination.value = { ...pagination.value, itemsPerPage, page: 1 }
    updatePagination()
  }

  const selectItem = (item: T) => {
    const id = getItemId(item)
    const index = selectedItems.value.findIndex(i => getItemId(i) === id)
    if (index === -1) {
      selectedItems.value = [...selectedItems.value, item]
    } else {
      selectedItems.value = selectedItems.value.filter(i => getItemId(i) !== id)
    }
  }

  const selectItems = (itemsToSelect: T[]) => {
    const ids = new Set(selectedIds.value)
    const newItems = itemsToSelect.filter(item => !ids.has(getItemId(item)))
    selectedItems.value = [...selectedItems.value, ...newItems]
  }

  const deselectItems = (itemsToDeselect: T[]) => {
    const idsToRemove = new Set(itemsToDeselect.map(item => getItemId(item)))
    selectedItems.value = selectedItems.value.filter(item => !idsToRemove.has(getItemId(item)))
  }

  const selectAll = () => {
    if (isAllSelected.value) {
      selectedItems.value = []
    } else {
      selectedItems.value = [...items.value]
    }
  }

  const selectPage = () => {
    if (isPageSelected.value) {
      deselectItems(paginatedItems.value)
    } else {
      selectItems(paginatedItems.value)
    }
  }

  const clearSelection = () => {
    selectedItems.value = []
  }

  const isSelected = (item: T): boolean => {
    return selectedIds.value.includes(getItemId(item))
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const reset = () => {
    items.value = []
    selectedItems.value = []
    sort.value = null
    pagination.value = {
      page: 1,
      itemsPerPage: options.itemsPerPage || 10,
      totalItems: 0,
      totalPages: 1,
    }
  }

  return {
    items: computed(() => items.value),
    headers: computed(() => headers.value),
    sort: computed(() => sort.value),
    pagination: computed(() => pagination.value),
    selectedItems: computed(() => selectedItems.value),
    isLoading: computed(() => isLoading.value),
    sortedItems,
    paginatedItems,
    isAllSelected,
    isPageSelected,
    isIndeterminate,
    selectedCount,
    selectedIds,
    setItems,
    setHeaders,
    toggleSort,
    setSort,
    clearSort,
    setPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    setItemsPerPage,
    selectItem,
    selectItems,
    deselectItems,
    selectAll,
    selectPage,
    clearSelection,
    isSelected,
    setLoading,
    reset,
  }
}

export function defineDataTable<T = unknown>(
  id: string,
  options: DataTableOptions<T> = {}
): () => DataTableReturn<T> {
  return registerDataTable(id, () => createDataTable<T>(options))
}
