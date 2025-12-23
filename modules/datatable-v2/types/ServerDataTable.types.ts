import type { DataTableOptions } from './DataTable.types'

export interface ServerFetchParams {
  page: number
  itemsPerPage: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
  filters?: Record<string, unknown>
}

export interface ServerFetchResponse<T = unknown> {
  items: T[]
  total: number
}

export interface DataTableFilters {
  search: string
  filters: Record<string, unknown>
}

export type PayloadBuilderFunction = (params: ServerFetchParams) => unknown

export interface ServerDataTableOptions<T = unknown> extends DataTableOptions<T> {
  fetchFunction: (payload: unknown) => Promise<ServerFetchResponse<T>>
  payloadBuilder?: PayloadBuilderFunction
  autoFetch?: boolean
  debounceMs?: number
}
