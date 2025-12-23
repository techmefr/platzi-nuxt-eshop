import type { ServerFetchParams } from './ServerDataTable.types'

export interface LomkitPayload {
  pagination: {
    page: number
    limit: number
  }
  sorts?: Array<{
    field: string
    direction: string
  }>
  search?: {
    query: string
  }
  filters?: Array<{
    field: string
    operator: string
    value: unknown
  }>
}

export interface GraphQLPayload {
  pagination: {
    page: number
    limit: number
  }
  sort?: {
    field: string
    order: string
  }
  search?: string
  filters?: Record<string, unknown>
}
