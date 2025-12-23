export interface DataTableHeader {
  key: string
  title: string
  sortable?: boolean
  align?: 'start' | 'center' | 'end'
  width?: string | number
  fixed?: boolean
}

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

export interface DataTableOptions<T = unknown> {
  headers?: DataTableHeader[]
  items?: T[]
  itemsPerPage?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  multiSort?: boolean
  itemKey?: string | ((item: T) => string | number)
}
