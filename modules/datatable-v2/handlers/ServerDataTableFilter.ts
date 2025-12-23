import type { ServerDataTableState } from '../state/ServerDataTableState'
import type { ServerDataTableFetcher } from './ServerDataTableFetcher'

export class ServerDataTableFilter<T = unknown> {
  protected searchDebounce: ReturnType<typeof setTimeout> | null = null
  protected debounceMs: number

  constructor(
    protected state: ServerDataTableState<T>,
    protected fetcher: ServerDataTableFetcher<T>,
    debounceMs: number = 300
  ) {
    this.debounceMs = debounceMs
  }

  setSearch(search: string, immediate: boolean = false) {
    this.state.setSearch(search)

    if (this.searchDebounce) {
      clearTimeout(this.searchDebounce)
    }

    if (immediate) {
      this.state.setPagination({ page: 1 })
      this.fetcher.fetchItems()
    } else {
      this.searchDebounce = setTimeout(() => {
        this.state.setPagination({ page: 1 })
        this.fetcher.fetchItems()
      }, this.debounceMs)
    }
  }

  setFilter(key: string, value: unknown) {
    this.state.setFilter(key, value)
    this.state.setPagination({ page: 1 })
    this.fetcher.fetchItems()
  }

  setFilters(filters: Record<string, unknown>) {
    this.state.setFilters({ filters })
    this.state.setPagination({ page: 1 })
    this.fetcher.fetchItems()
  }

  clearFilters() {
    this.state.clearFilters()
    this.state.setPagination({ page: 1 })
    this.fetcher.fetchItems()
  }

  clearSearch() {
    this.setSearch('', true)
  }

  getSearch() {
    return computed(() => this.state.getFilters().value.search)
  }

  getFilters() {
    return computed(() => this.state.getFilters().value.filters)
  }
}
