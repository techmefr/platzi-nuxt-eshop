import type { 
  DataTableHeader, 
  DataTableSort, 
  DataTablePagination, 
  DataTableOptions 
} from '../types/DataTable.types'

export class DataTableState<T = unknown> {
  protected items = ref<T[]>([])
  protected headers = ref<DataTableHeader[]>([])
  protected sort = ref<DataTableSort | null>(null)
  protected pagination = ref<DataTablePagination>({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  })
  protected selectedItems = ref<T[]>([])
  protected isLoading = ref(false)

  constructor(options: DataTableOptions<T> = {}) {
    if (options.headers) {
      this.headers.value = options.headers
    }
    
    if (options.items) {
      this.setItems(options.items)
    }
    
    if (options.itemsPerPage) {
      this.pagination.value.itemsPerPage = options.itemsPerPage
    }
    
    if (options.sortBy && options.sortOrder) {
      this.sort.value = { key: options.sortBy, order: options.sortOrder }
    }
  }

  getItems() {
    return computed(() => this.items.value)
  }

  getHeaders() {
    return computed(() => this.headers.value)
  }

  getSort() {
    return computed(() => this.sort.value)
  }

  getPagination() {
    return computed(() => this.pagination.value)
  }

  getSelectedItems() {
    return computed(() => this.selectedItems.value)
  }

  getIsLoading() {
    return computed(() => this.isLoading.value)
  }

  setItems(items: T[]) {
    this.items.value = items
    this.updateTotalItems(items.length)
  }

  setHeaders(headers: DataTableHeader[]) {
    this.headers.value = headers
  }

  setSort(sort: DataTableSort | null) {
    this.sort.value = sort
  }

  setPagination(pagination: Partial<DataTablePagination>) {
    this.pagination.value = { ...this.pagination.value, ...pagination }
  }

  setSelectedItems(items: T[]) {
    this.selectedItems.value = items
  }

  setLoading(isLoading: boolean) {
    this.isLoading.value = isLoading
  }

  updateTotalItems(total: number) {
    this.pagination.value.totalItems = total
    this.pagination.value.totalPages = Math.ceil(
      total / this.pagination.value.itemsPerPage
    )
  }

  reset() {
    this.items.value = []
    this.sort.value = null
    this.pagination.value = {
      page: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0,
    }
    this.selectedItems.value = []
    this.isLoading.value = false
  }
}
