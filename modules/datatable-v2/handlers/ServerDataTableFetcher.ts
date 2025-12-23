import type { ServerDataTableState } from '../state/ServerDataTableState'
import type { ServerFetchParams } from '../types/ServerDataTable.types'

export class ServerDataTableFetcher<T = unknown> {
  protected abortController: AbortController | null = null

  constructor(protected state: ServerDataTableState<T>) {}

  async fetchItems(additionalParams: Partial<ServerFetchParams> = {}) {
    if (this.abortController) {
      this.abortController.abort()
    }

    this.abortController = new AbortController()
    this.state.setLoading(true)
    this.state.setIsRefreshing(true)

    try {
      const pagination = this.state.getPagination().value
      const sort = this.state.getSort().value
      const filters = this.state.getFilters().value

      const params: ServerFetchParams = {
        page: pagination.page,
        itemsPerPage: pagination.itemsPerPage,
        sortBy: sort?.key,
        sortOrder: sort?.order,
        search: filters.search,
        filters: filters.filters,
        ...additionalParams
      }

      this.state.setLastFetchParams(params)

      const payloadBuilder = this.state.getPayloadBuilder()
      const payload = payloadBuilder(params)

      const fetchFunction = this.state.getFetchFunction()
      const response = await fetchFunction(payload)

      this.state.setItems(response.items)
      this.state.updateTotalItems(response.total)
      this.state.setLastUpdate(new Date())

      return response
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        throw error
      }
    } finally {
      this.state.setLoading(false)
      this.state.setIsRefreshing(false)
      this.abortController = null
    }
  }

  async refresh() {
    const lastParams = this.state.getLastFetchParams().value
    if (lastParams) {
      await this.fetchItems(lastParams)
    } else {
      await this.fetchItems()
    }
  }

  cancelFetch() {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }
}
