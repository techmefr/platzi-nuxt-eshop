export interface DataTableSort {
  key: string
  order: 'asc' | 'desc'
}

export interface DataTablePagination {
  page: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

export interface DataTableHeader {
  key: string
  label: string
  sortable?: boolean
  width?: string
}

export interface DataTableOptions<T> {
  items?: T[]
  headers?: DataTableHeader[]
  itemKey?: string | ((item: T) => string | number)
  itemsPerPage?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ServerFetchParams {
  page: number
  itemsPerPage: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
  filters?: Record<string, unknown>
}

export interface ServerFetchResponse<T> {
  items: T[]
  total: number
}

export type PayloadBuilderFunction = (params: ServerFetchParams) => unknown

export type FetchFunction<T> = (payload: unknown) => Promise<ServerFetchResponse<T>>

export interface ServerDataTableOptions<T> extends DataTableOptions<T> {
  fetchFn: FetchFunction<T>
  payloadBuilder?: PayloadBuilderFunction
  debounceMs?: number
  autoFetch?: boolean
}

export interface DataTableState<T> {
  items: T[]
  headers: DataTableHeader[]
  sort: DataTableSort | null
  pagination: DataTablePagination
  selectedItems: T[]
  isLoading: boolean
}

export interface ServerDataTableState<T> extends DataTableState<T> {
  search: string
  filters: Record<string, unknown>
  isRefreshing: boolean
  lastUpdate: Date | null
}
