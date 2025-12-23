import type { DataTableOptions, DataTableHeader } from './types/DataTable.types'
import { DataTableState } from './state/DataTableState'
import { DataTableSorter } from './handlers/DataTableSorter'
import { DataTablePaginator } from './handlers/DataTablePaginator'
import { DataTableSelector } from './handlers/DataTableSelector'

export class DataTable<T = unknown> {
  protected state: DataTableState<T>
  protected sorter: DataTableSorter<T>
  protected paginator: DataTablePaginator<T>
  protected selector: DataTableSelector<T>

  constructor(options: DataTableOptions<T> = {}) {
    this.state = new DataTableState<T>(options)
    this.sorter = new DataTableSorter<T>(this.state)
    this.paginator = new DataTablePaginator<T>(
      this.state,
      () => this.sorter.getSortedItems()
    )
    this.selector = new DataTableSelector<T>(
      this.state,
      options.itemKey || 'id'
    )
  }

  getItems() {
    return this.state.getItems()
  }

  getHeaders() {
    return this.state.getHeaders()
  }

  getSort() {
    return this.state.getSort()
  }

  getPagination() {
    return this.state.getPagination()
  }

  getSelectedItems() {
    return this.state.getSelectedItems()
  }

  getIsLoading() {
    return this.state.getIsLoading()
  }

  getSortedItems() {
    return this.sorter.getSortedItems()
  }

  getPaginatedItems() {
    return this.paginator.getPaginatedItems()
  }

  isAllSelected() {
    return this.selector.isAllSelected()
  }

  isPageSelected() {
    return this.selector.isPageSelected(this.getPaginatedItems().value)
  }

  isIndeterminate() {
    return this.selector.isIndeterminate()
  }

  isPageIndeterminate() {
    return this.selector.isPageIndeterminate(this.getPaginatedItems().value)
  }

  getSelectedCount() {
    return this.selector.getSelectedCount()
  }

  getSelectedIds() {
    return this.selector.getSelectedIds()
  }

  setItems(items: T[]) {
    this.state.setItems(items)
  }

  setHeaders(headers: DataTableHeader[]) {
    this.state.setHeaders(headers)
  }

  toggleSort(key: string) {
    this.sorter.toggleSort(key)
  }

  setSort(key: string, order: 'asc' | 'desc') {
    this.sorter.setSort(key, order)
  }

  clearSort() {
    this.sorter.clearSort()
  }

  setPage(page: number) {
    this.paginator.setPage(page)
  }

  nextPage() {
    this.paginator.nextPage()
  }

  previousPage() {
    this.paginator.previousPage()
  }

  goToFirstPage() {
    this.paginator.goToFirstPage()
  }

  goToLastPage() {
    this.paginator.goToLastPage()
  }

  setItemsPerPage(itemsPerPage: number) {
    this.paginator.setItemsPerPage(itemsPerPage)
  }

  selectItem(item: T) {
    this.selector.selectItem(item)
  }

  selectItems(items: T[]) {
    this.selector.selectItems(items)
  }

  deselectItems(items: T[]) {
    this.selector.deselectItems(items)
  }

  selectAll() {
    this.selector.selectAll()
  }

  selectPage() {
    this.selector.selectPage(this.getPaginatedItems().value)
  }

  clearSelection() {
    this.selector.clearSelection()
  }

  isSelected(item: T): boolean {
    return this.selector.isSelected(item)
  }

  setLoading(isLoading: boolean) {
    this.state.setLoading(isLoading)
  }

  reset() {
    this.state.reset()
  }
}
