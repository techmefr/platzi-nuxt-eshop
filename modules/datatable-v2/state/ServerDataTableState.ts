import type { 
  ServerDataTableOptions, 
  ServerFetchParams, 
  DataTableFilters, 
  PayloadBuilderFunction,
  ServerFetchResponse
} from '../types/ServerDataTable.types'
import { DataTableState } from './DataTableState'

export class ServerDataTableState<T = unknown> extends DataTableState<T> {
  protected fetchFunction: (payload: unknown) => Promise<ServerFetchResponse<T>>
  protected payloadBuilder: PayloadBuilderFunction
  protected isRefreshing = ref(false)
  protected lastUpdate = ref<Date | null>(null)
  protected lastFetchParams = ref<ServerFetchParams | null>(null)
  protected filters = ref<DataTableFilters>({
    search: '',
    filters: {}
  })

  constructor(options: ServerDataTableOptions<T>) {
    super(options)
    this.fetchFunction = options.fetchFunction
    this.payloadBuilder = options.payloadBuilder || this.defaultPayloadBuilder
  }

  protected defaultPayloadBuilder(params: ServerFetchParams): unknown {
    const payload: Record<string, unknown> = {
      page: params.page,
      per_page: params.itemsPerPage,
    }

    if (params.sortBy) {
      payload.sort_by = params.sortBy
      payload.sort_order = params.sortOrder || 'asc'
    }

    if (params.search) {
      payload.search = params.search
    }

    if (params.filters && Object.keys(params.filters).length > 0) {
      payload.filters = params.filters
    }

    return payload
  }

  getFetchFunction() {
    return this.fetchFunction
  }

  getPayloadBuilder() {
    return this.payloadBuilder
  }

  getIsRefreshing() {
    return computed(() => this.isRefreshing.value)
  }

  getLastUpdate() {
    return computed(() => this.lastUpdate.value)
  }

  getLastFetchParams() {
    return computed(() => this.lastFetchParams.value)
  }

  getFilters() {
    return computed(() => this.filters.value)
  }

  setIsRefreshing(isRefreshing: boolean) {
    this.isRefreshing.value = isRefreshing
  }

  setLastUpdate(date: Date) {
    this.lastUpdate.value = date
  }

  setLastFetchParams(params: ServerFetchParams) {
    this.lastFetchParams.value = params
  }

  setFilters(filters: Partial<DataTableFilters>) {
    this.filters.value = { ...this.filters.value, ...filters }
  }

  setSearch(search: string) {
    this.filters.value.search = search
  }

  setFilter(key: string, value: unknown) {
    this.filters.value.filters[key] = value
  }

  clearFilters() {
    this.filters.value = {
      search: '',
      filters: {}
    }
  }

  override reset() {
    super.reset()
    this.isRefreshing.value = false
    this.lastUpdate.value = null
    this.lastFetchParams.value = null
    this.filters.value = {
      search: '',
      filters: {}
    }
  }
}
