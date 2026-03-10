import { apiRequest } from './apiClient'

export interface LanguageValue {
  id: string
  key: string
  value: string
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

export async function fetchLanguageValues(
  baseUrl: string,
  accessToken: string,
  pageNumber: number = 1,
  pageSize: number = 15,
): Promise<PaginatedResponse<LanguageValue>> {
  const result = await apiRequest({
    baseUrl,
    path: `/language-values/all?PageNumber=${pageNumber}&PageSize=${pageSize}`,
    method: 'GET',
    accessToken,
    errorPrefix: 'Failed to fetch language values',
  })

  if (result && typeof result === 'object') {
    const response = result as ApiResponse<LanguageValue>
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

export async function searchLanguageValues(
  baseUrl: string,
  accessToken: string,
  query: string,
  pageNumber: number = 1,
  pageSize: number = 15,
): Promise<PaginatedResponse<LanguageValue>> {
  const result = await apiRequest({
    baseUrl,
    path: `/language-values/search`,
    method: 'POST',
    body: {
      key: query,
      value: query,
      pagination: { pageNumber, pageSize },
    },
    accessToken,
    errorPrefix: 'Failed to search language values',
  })

  if (result && typeof result === 'object') {
    const response = result as ApiResponse<LanguageValue>
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
