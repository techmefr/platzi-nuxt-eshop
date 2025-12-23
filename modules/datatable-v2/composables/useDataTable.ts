import { DataTable } from '../DataTable'
import type { DataTableOptions } from '../types/DataTable.types'

export function useDataTable<T = unknown>(options: DataTableOptions<T> = {}) {
  const table = new DataTable<T>(options)

  return {
    items: table.getItems(),
    headers: table.getHeaders(),
    sort: table.getSort(),
    pagination: table.getPagination(),
    selectedItems: table.getSelectedItems(),
    isLoading: table.getIsLoading(),
    sortedItems: table.getSortedItems(),
    paginatedItems: table.getPaginatedItems(),
    isAllSelected: table.isAllSelected(),
    isPageSelected: table.isPageSelected(),
    isIndeterminate: table.isIndeterminate(),
    isPageIndeterminate: table.isPageIndeterminate(),
    selectedCount: table.getSelectedCount(),
    selectedIds: table.getSelectedIds(),

    setItems: table.setItems.bind(table),
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
    selectItem: table.selectItem.bind(table),
    selectItems: table.selectItems.bind(table),
    deselectItems: table.deselectItems.bind(table),
    selectAll: table.selectAll.bind(table),
    selectPage: table.selectPage.bind(table),
    clearSelection: table.clearSelection.bind(table),
    isSelected: table.isSelected.bind(table),
    setLoading: table.setLoading.bind(table),
    reset: table.reset.bind(table),
  }
}
