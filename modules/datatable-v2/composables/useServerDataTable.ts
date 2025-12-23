import { ServerDataTable } from '../ServerDataTable'
import type { ServerDataTableOptions } from '../types/ServerDataTable.types'

export function useServerDataTable<T = unknown>(options: ServerDataTableOptions<T>) {
  const table = new ServerDataTable<T>(options)

  return {
    items: table.getItems(),
    headers: table.getHeaders(),
    sort: table.getSort(),
    pagination: table.getPagination(),
    selectedItems: table.getSelectedItems(),
    isLoading: table.getIsLoading(),
    isRefreshing: table.getIsRefreshing(),
    lastUpdate: table.getLastUpdate(),
    paginatedItems: table.getPaginatedItems(),
    search: table.getSearch(),
    filters: table.getFilters(),
    isAllSelected: table.isAllSelected(),
    isPageSelected: table.isPageSelected(),
    isIndeterminate: table.isIndeterminate(),
    isPageIndeterminate: table.isPageIndeterminate(),
    selectedCount: table.getSelectedCount(),
    selectedIds: table.getSelectedIds(),

    setHeaders: table.setHeaders.bind(table),
    toggleSort: table.toggleSort.bind(table),
    setSort: table.setSort.bind(table),
    clearSort: table.clearSort.bind(table),
    setPage: table.setPage.bind(table),
    nextPage: table.nextPage.bind(table),
    previousPage: table.previousPage.bind(table),
    goToFirstPage: table.goToFirstPage.bind(table),
    goToLastPage: table.goToLastPage.bind(table),
    setItemsPerPage: table.setItemsPerPage.bind(table),
    setSearch: table.setSearch.bind(table),
    setFilter: table.setFilter.bind(table),
    setFilters: table.setFilters.bind(table),
    clearFilters: table.clearFilters.bind(table),
    clearSearch: table.clearSearch.bind(table),
    selectItem: table.selectItem.bind(table),
    selectItems: table.selectItems.bind(table),
    deselectItems: table.deselectItems.bind(table),
    selectAll: table.selectAll.bind(table),
    selectPage: table.selectPage.bind(table),
    clearSelection: table.clearSelection.bind(table),
    isSelected: table.isSelected.bind(table),
    fetchItems: table.fetchItems.bind(table),
    refresh: table.refresh.bind(table),
    cancelFetch: table.cancelFetch.bind(table),
    reset: table.reset.bind(table),
  }
}
