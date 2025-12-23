import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { registerDataTable } from './store/registry'
import type {
  ServerDataTableOptions,
  DataTableHeader,
  DataTableSort,
  DataTablePagination,
  ServerFetchParams,
  FetchFunction,
  PayloadBuilderFunction,
} from './types'

interface ServerDataTableReturn<T> {
  items: ComputedRef<T[]>
  headers: ComputedRef<DataTableHeader[]>
  sort: ComputedRef<DataTableSort | null>
  pagination: ComputedRef<DataTablePagination>
  selectedItems: ComputedRef<T[]>
  isLoading: ComputedRef<boolean>
  isRefreshing: ComputedRef<boolean>
  lastUpdate: ComputedRef<Date | null>
  search: ComputedRef<string>
  filters: ComputedRef<Record<string, unknown>>
  isAllSelected: ComputedRef<boolean>
  isPageSelected: ComputedRef<boolean>
  isIndeterminate: ComputedRef<boolean>
  selectedCount: ComputedRef<number>
  selectedIds: ComputedRef<(string | number)[]>
  setHeaders: (headers: DataTableHeader[]) => void
  toggleSort: (key: string) => Promise<void>
  setSort: (key: string, order: 'asc' | 'desc') => Promise<void>
  clearSort: () => Promise<void>
  setPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  goToFirstPage: () => Promise<void>
  goToLastPage: () => Promise<void>
  setItemsPerPage: (itemsPerPage: number) => Promise<void>
  setSearch: (search: string, immediate?: boolean) => void
  setFilter: (key: string, value: unknown) => void
  setFilters: (filters: Record<string, unknown>) => void
  clearFilters: () => void
  clearSearch: () => void
  selectItem: (item: T) => void
  selectItems: (items: T[]) => void
  deselectItems: (items: T[]) => void
  selectAll: () => void
  selectPage: () => void
  clearSelection: () => void
  isSelected: (item: T) => boolean
  fetchItems: () => Promise<void>
  refresh: () => Promise<void>
  reset: () => void
}

const defaultPayloadBuilder: PayloadBuilderFunction = (params: ServerFetchParams) => {
  const payload: Record<string, unknown> = {
    page: params.page,
    per_page: params.itemsPerPage,
  }

  if (params.sortBy) {
    payload.sort_by = params.sortBy
    payload.sort_order = params.sortOrder || 'asc'
  }

  if (params.search) {
    payload.search = params.search
  }

  if (params.filters && Object.keys(params.filters).length > 0) {
    payload.filters = params.filters
  }

  return payload
}

function createServerDataTable<T>(options: ServerDataTableOptions<T>): ServerDataTableReturn<T> {
  const itemKey = options.itemKey || 'id'
  const debounceMs = options.debounceMs || 300
  const payloadBuilder = options.payloadBuilder || defaultPayloadBuilder
  const fetchFn: FetchFunction<T> = options.fetchFn

  const items: Ref<T[]> = ref([]) as Ref<T[]>
  const headers: Ref<DataTableHeader[]> = ref(options.headers || [])
  const sort: Ref<DataTableSort | null> = ref(
    options.sortBy ? { key: options.sortBy, order: options.sortOrder || 'asc' } : null
  )
  const pagination: Ref<DataTablePagination> = ref({
    page: 1,
    itemsPerPage: options.itemsPerPage || 10,
    totalItems: 0,
    totalPages: 1,
  })
  const selectedItems: Ref<T[]> = ref([]) as Ref<T[]>
  const isLoading = ref(false)
  const isRefreshing = ref(false)
  const lastUpdate: Ref<Date | null> = ref(null)
  const search = ref('')
  const filters: Ref<Record<string, unknown>> = ref({})

  let searchDebounce: ReturnType<typeof setTimeout> | null = null
  let abortController: AbortController | null = null

  const getItemId = (item: T): string | number => {
    if (typeof itemKey === 'function') {
      return itemKey(item)
    }
    return (item as Record<string, unknown>)[itemKey] as string | number
  }

  const selectedIds = computed(() => selectedItems.value.map(item => getItemId(item)))

  const isAllSelected = computed(() => {
    return items.value.length > 0 && selectedItems.value.length === items.value.length
  })

  const isPageSelected = computed(() => {
    const ids = new Set(selectedIds.value)
    return items.value.length > 0 && items.value.every(item => ids.has(getItemId(item)))
  })

  const isIndeterminate = computed(() => {
    return selectedItems.value.length > 0 && selectedItems.value.length < items.value.length
  })

  const selectedCount = computed(() => selectedItems.value.length)

  const fetchItems = async () => {
    if (abortController) {
      abortController.abort()
    }

    abortController = new AbortController()
    isLoading.value = true
    isRefreshing.value = true

    try {
      const params: ServerFetchParams = {
        page: pagination.value.page,
        itemsPerPage: pagination.value.itemsPerPage,
        sortBy: sort.value?.key,
        sortOrder: sort.value?.order,
        search: search.value,
        filters: filters.value,
      }

      const payload = payloadBuilder(params)
      const response = await fetchFn(payload)

      items.value = response.items
      pagination.value = {
        ...pagination.value,
        totalItems: response.total,
        totalPages: Math.ceil(response.total / pagination.value.itemsPerPage) || 1,
      }
      lastUpdate.value = new Date()
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        throw error
      }
    } finally {
      isLoading.value = false
      isRefreshing.value = false
      abortController = null
    }
  }

  const setHeaders = (newHeaders: DataTableHeader[]) => {
    headers.value = newHeaders
  }

  const toggleSort = async (key: string) => {
    const currentSort = sort.value
    if (!currentSort || currentSort.key !== key) {
      sort.value = { key, order: 'asc' }
    } else if (currentSort.order === 'asc') {
      sort.value = { key, order: 'desc' }
    } else {
      sort.value = null
    }
    await fetchItems()
  }

  const setSort = async (key: string, order: 'asc' | 'desc') => {
    sort.value = { key, order }
    await fetchItems()
  }

  const clearSort = async () => {
    sort.value = null
    await fetchItems()
  }

  const setPage = async (page: number) => {
    const maxPage = pagination.value.totalPages || 1
    const newPage = Math.max(1, Math.min(page, maxPage))
    pagination.value = { ...pagination.value, page: newPage }
    await fetchItems()
  }

  const nextPage = async () => {
    if (pagination.value.page < pagination.value.totalPages) {
      await setPage(pagination.value.page + 1)
    }
  }

  const previousPage = async () => {
    if (pagination.value.page > 1) {
      await setPage(pagination.value.page - 1)
    }
  }

  const goToFirstPage = async () => await setPage(1)

  const goToLastPage = async () => await setPage(pagination.value.totalPages)

  const setItemsPerPage = async (itemsPerPage: number) => {
    pagination.value = { ...pagination.value, itemsPerPage, page: 1 }
    await fetchItems()
  }

  const setSearch = (newSearch: string, immediate = false) => {
    search.value = newSearch

    if (searchDebounce) {
      clearTimeout(searchDebounce)
    }

    if (immediate) {
      pagination.value = { ...pagination.value, page: 1 }
      fetchItems()
    } else {
      searchDebounce = setTimeout(() => {
        pagination.value = { ...pagination.value, page: 1 }
        fetchItems()
      }, debounceMs)
    }
  }

  const setFilter = (key: string, value: unknown) => {
    filters.value = { ...filters.value, [key]: value }
    pagination.value = { ...pagination.value, page: 1 }
    fetchItems()
  }

  const setFilters = (newFilters: Record<string, unknown>) => {
    filters.value = newFilters
    pagination.value = { ...pagination.value, page: 1 }
    fetchItems()
  }

  const clearFilters = () => {
    filters.value = {}
    pagination.value = { ...pagination.value, page: 1 }
    fetchItems()
  }

  const clearSearch = () => {
    setSearch('', true)
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
      deselectItems(items.value)
    } else {
      selectItems(items.value)
    }
  }

  const clearSelection = () => {
    selectedItems.value = []
  }

  const isSelected = (item: T): boolean => {
    return selectedIds.value.includes(getItemId(item))
  }

  const refresh = async () => {
    await fetchItems()
  }

  const reset = () => {
    items.value = []
    selectedItems.value = []
    sort.value = null
    search.value = ''
    filters.value = {}
    pagination.value = {
      page: 1,
      itemsPerPage: options.itemsPerPage || 10,
      totalItems: 0,
      totalPages: 1,
    }
    lastUpdate.value = null
  }

  if (options.autoFetch !== false) {
    fetchItems()
  }

  return {
    items: computed(() => items.value),
    headers: computed(() => headers.value),
    sort: computed(() => sort.value),
    pagination: computed(() => pagination.value),
    selectedItems: computed(() => selectedItems.value),
    isLoading: computed(() => isLoading.value),
    isRefreshing: computed(() => isRefreshing.value),
    lastUpdate: computed(() => lastUpdate.value),
    search: computed(() => search.value),
    filters: computed(() => filters.value),
    isAllSelected,
    isPageSelected,
    isIndeterminate,
    selectedCount,
    selectedIds,
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
    setSearch,
    setFilter,
    setFilters,
    clearFilters,
    clearSearch,
    selectItem,
    selectItems,
    deselectItems,
    selectAll,
    selectPage,
    clearSelection,
    isSelected,
    fetchItems,
    refresh,
    reset,
  }
}

export function defineServerDataTable<T = unknown>(
  id: string,
  options: ServerDataTableOptions<T>
): () => ServerDataTableReturn<T> {
  return registerDataTable(id, () => createServerDataTable<T>(options))
}
