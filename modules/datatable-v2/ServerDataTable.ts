import type { ServerDataTableOptions, DataTableHeader } from './types/ServerDataTable.types'
import { DataTable } from './DataTable'
import { ServerDataTableState } from './state/ServerDataTableState'
import { ServerDataTableFetcher } from './handlers/ServerDataTableFetcher'
import { ServerDataTableFilter } from './handlers/ServerDataTableFilter'
import { DataTableSorter } from './handlers/DataTableSorter'
import { DataTablePaginator } from './handlers/DataTablePaginator'
import { DataTableSelector } from './handlers/DataTableSelector'

export class ServerDataTable<T = unknown> extends DataTable<T> {
  protected override state: ServerDataTableState<T>
  protected fetcher: ServerDataTableFetcher<T>
  protected filter: ServerDataTableFilter<T>

  constructor(options: ServerDataTableOptions<T>) {
    super()
    
    this.state = new ServerDataTableState<T>(options)
    this.fetcher = new ServerDataTableFetcher<T>(this.state)
    this.filter = new ServerDataTableFilter<T>(
      this.state,
      this.fetcher,
      options.debounceMs
    )
    
    this.sorter = new DataTableSorter<T>(this.state)
    this.paginator = new DataTablePaginator<T>(
      this.state,
      () => this.state.getItems()
    )
    this.selector = new DataTableSelector<T>(
      this.state,
      options.itemKey || 'id'
    )

    if (options.autoFetch !== false) {
      this.fetchItems()
    }
  }

  override getItems() {
    return this.state.getItems()
  }

  getIsRefreshing() {
    return this.state.getIsRefreshing()
  }

  getLastUpdate() {
    return this.state.getLastUpdate()
  }

  getSearch() {
    return this.filter.getSearch()
  }

  getFilters() {
    return this.filter.getFilters()
  }

  override getPaginatedItems() {
    return this.state.getItems()
  }

  override setHeaders(headers: DataTableHeader[]) {
    this.state.setHeaders(headers)
  }

  async toggleSort(key: string) {
    this.sorter.toggleSort(key)
    await this.fetchItems()
  }

  async setSort(key: string, order: 'asc' | 'desc') {
    this.sorter.setSort(key, order)
    await this.fetchItems()
  }

  async clearSort() {
    this.sorter.clearSort()
    await this.fetchItems()
  }

  async setPage(page: number) {
    this.paginator.setPage(page)
    await this.fetchItems()
  }

  async nextPage() {
    this.paginator.nextPage()
    await this.fetchItems()
  }

  async previousPage() {
    this.paginator.previousPage()
    await this.fetchItems()
  }

  async goToFirstPage() {
    this.paginator.goToFirstPage()
    await this.fetchItems()
  }

  async goToLastPage() {
    this.paginator.goToLastPage()
    await this.fetchItems()
  }

  async setItemsPerPage(itemsPerPage: number) {
    this.state.setPagination({ itemsPerPage, page: 1 })
    await this.fetchItems()
  }

  setSearch(search: string, immediate?: boolean) {
    this.filter.setSearch(search, immediate)
  }

  setFilter(key: string, value: unknown) {
    this.filter.setFilter(key, value)
  }

  setFilters(filters: Record<string, unknown>) {
    this.filter.setFilters(filters)
  }

  clearFilters() {
    this.filter.clearFilters()
  }

  clearSearch() {
    this.filter.clearSearch()
  }

  async fetchItems() {
    return this.fetcher.fetchItems()
  }

  async refresh() {
    return this.fetcher.refresh()
  }

  cancelFetch() {
    this.fetcher.cancelFetch()
  }

  override reset() {
    this.state.reset()
  }
}
