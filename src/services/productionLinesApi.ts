import { apiRequest } from './apiClient'

export interface ProductionLine {
  id: number
  name: string
  [key: string]: unknown
}

export interface PaginatedResponse<T> {
  pageNumber: number
  pageSize: number
  totalPages: number
  totalItemCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  items: T[]
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: PaginatedResponse<T>
  errors: unknown[]
}

export async function fetchProductionLines(
  baseUrl: string,
  accessToken: string,
  pageNumber: number = 1,
  pageSize: number = 15,
): Promise<PaginatedResponse<ProductionLine>> {
  const result = await apiRequest({
    baseUrl,
    path: `/production-lines/all?PageNumber=${pageNumber}&PageSize=${pageSize}`,
    method: 'GET',
    accessToken,
    errorPrefix: 'Failed to fetch production lines',
  })

  if (result && typeof result === 'object') {
    const response = result as ApiResponse<ProductionLine>
    if (response.data) {
      return response.data
    }
  }

  return {
    pageNumber,
    pageSize,
    totalPages: 0,
    totalItemCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    items: [],
  }
}

export async function searchProductionLines(
  baseUrl: string,
  accessToken: string,
  query: string,
  pageNumber: number = 1,
  pageSize: number = 15,
): Promise<PaginatedResponse<ProductionLine>> {
  const result = await apiRequest({
    baseUrl,
    path: `/production-lines/search`,
    method: 'POST',
    body: {
      name: query,
      shortName: query,
      pagination: { pageNumber, pageSize },
    },
    accessToken,
    errorPrefix: 'Failed to search production lines',
  })

  if (result && typeof result === 'object') {
    const response = result as ApiResponse<ProductionLine>
    if (response.data) {
      return response.data
    }
  }

  return {
    pageNumber,
    pageSize,
    totalPages: 0,
    totalItemCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    items: [],
  }
}
