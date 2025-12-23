import type { ServerFetchParams, PayloadBuilderFunction } from './types'

export const defaultPayloadBuilder: PayloadBuilderFunction = (params: ServerFetchParams) => {
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

export const lomkitPayloadBuilder: PayloadBuilderFunction = (params: ServerFetchParams) => {
  const payload: Record<string, unknown> = {
    pagination: {
      page: params.page,
      limit: params.itemsPerPage,
    },
  }

  if (params.sortBy) {
    payload.sorts = [
      {
        field: params.sortBy,
        direction: params.sortOrder || 'asc',
      },
    ]
  }

  if (params.search) {
    payload.search = {
      query: params.search,
    }
  }

  if (params.filters && Object.keys(params.filters).length > 0) {
    payload.filters = Object.entries(params.filters).map(([field, value]) => ({
      field,
      operator: '=',
      value,
    }))
  }

  return payload
}

export const graphqlPayloadBuilder: PayloadBuilderFunction = (params: ServerFetchParams) => {
  const payload: Record<string, unknown> = {
    pagination: {
      page: params.page,
      limit: params.itemsPerPage,
    },
  }

  if (params.sortBy) {
    payload.sort = {
      field: params.sortBy,
      order: params.sortOrder?.toUpperCase() || 'ASC',
    }
  }

  if (params.search) {
    payload.search = params.search
  }

  if (params.filters) {
    payload.filters = params.filters
  }

  return payload
}

export function createPayloadBuilder(
  builderFn: PayloadBuilderFunction
): PayloadBuilderFunction {
  return builderFn
}
