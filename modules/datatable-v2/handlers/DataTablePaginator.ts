import type { DataTableState } from '../state/DataTableState'

export class DataTablePaginator<T = unknown> {
  constructor(
    protected state: DataTableState<T>,
    protected getSortedItems: () => ComputedRef<T[]>
  ) {}

  setPage(page: number) {
    const pagination = this.state.getPagination().value
    const maxPage = pagination.totalPages || 1
    
    if (page < 1) page = 1
    if (page > maxPage) page = maxPage
    
    this.state.setPagination({ page })
  }

  nextPage() {
    const pagination = this.state.getPagination().value
    if (pagination.page < pagination.totalPages) {
      this.setPage(pagination.page + 1)
    }
  }

  previousPage() {
    const pagination = this.state.getPagination().value
    if (pagination.page > 1) {
      this.setPage(pagination.page - 1)
    }
  }

  setItemsPerPage(itemsPerPage: number) {
    this.state.setPagination({ itemsPerPage, page: 1 })
    const items = this.state.getItems().value
    this.state.updateTotalItems(items.length)
  }

  getPaginatedItems() {
    return computed(() => {
      const sorted = this.getSortedItems().value
      const pagination = this.state.getPagination().value
      const start = (pagination.page - 1) * pagination.itemsPerPage
      const end = start + pagination.itemsPerPage
      return sorted.slice(start, end)
    })
  }

  goToFirstPage() {
    this.setPage(1)
  }

  goToLastPage() {
    const pagination = this.state.getPagination().value
    this.setPage(pagination.totalPages)
  }
}
