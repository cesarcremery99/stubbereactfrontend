import { apiRequest } from './apiClient'

export interface Country {
  id: number
  name: string
  code?: string
  isoCode?: string
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

export async function fetchCountries(
  baseUrl: string,
  accessToken: string,
  pageNumber: number = 1,
  pageSize: number = 15,
): Promise<PaginatedResponse<Country>> {
  const result = await apiRequest({
    baseUrl,
    path: `/countries/all?PageNumber=${pageNumber}&PageSize=${pageSize}`,
    method: 'GET',
    accessToken,
    errorPrefix: 'Failed to fetch countries',
  })

  if (result && typeof result === 'object') {
    const response = result as ApiResponse<Country>
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

export async function searchCountries(
  baseUrl: string,
  accessToken: string,
  query: string,
  pageNumber: number = 1,
  pageSize: number = 15,
): Promise<PaginatedResponse<Country>> {
  const result = await apiRequest({
    baseUrl,
    path: `/countries/search?Name=${encodeURIComponent(query)}&Pagination.PageNumber=${pageNumber}&Pagination.PageSize=${pageSize}`,
    method: 'GET',
    accessToken,
    errorPrefix: 'Failed to search countries',
  })

  if (result && typeof result === 'object') {
    const response = result as ApiResponse<Country>
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

export async function fetchCountriesReference(
  baseUrl: string,
  accessToken: string,
): Promise<Country[]> {
  const result = await apiRequest({
    baseUrl,
    path: '/countries/reference',
    method: 'GET',
    accessToken,
    errorPrefix: 'Failed to fetch countries reference',
  })

  if (result && typeof result === 'object') {
    // Handle the response wrapper format
    if ('data' in result && (result as { data?: unknown }).data) {
      const data = (result as { data?: unknown }).data as { items?: Country[] }
      if (data.items && Array.isArray(data.items)) {
        return data.items
      }
    }
    // Handle direct array response
    if (Array.isArray(result)) {
      return result as Country[]
    }
  }

  return []
}
