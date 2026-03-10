import { apiRequest } from './apiClient'

export interface Language {
  id: number
  name: string
  code: string
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

export async function fetchLanguages(
  baseUrl: string,
  accessToken: string,
  pageNumber: number = 1,
  pageSize: number = 15,
): Promise<PaginatedResponse<Language>> {
  const result = await apiRequest({
    baseUrl,
    path: `/languages/all?PageNumber=${pageNumber}&PageSize=${pageSize}`,
    method: 'GET',
    accessToken,
    errorPrefix: 'Failed to fetch languages',
  })

  if (result && typeof result === 'object') {
    const response = result as ApiResponse<Language>
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

export async function searchLanguages(
  baseUrl: string,
  accessToken: string,
  query: string,
  pageNumber: number = 1,
  pageSize: number = 15,
): Promise<PaginatedResponse<Language>> {
  const result = await apiRequest({
    baseUrl,
    path: `/languages/search`,
    method: 'POST',
    body: {
      name: query,
      pagination: { pageNumber, pageSize },
    },
    accessToken,
    errorPrefix: 'Failed to search languages',
  })

  if (result && typeof result === 'object') {
    const response = result as ApiResponse<Language>
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
