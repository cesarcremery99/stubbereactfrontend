import { apiRequest } from './apiClient'

export interface Product {
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

export async function fetchProducts(
  baseUrl: string,
  accessToken: string,
  pageNumber: number = 1,
  pageSize: number = 15,
): Promise<PaginatedResponse<Product>> {
  const result = await apiRequest({
    baseUrl,
    path: `/products/all?PageNumber=${pageNumber}&PageSize=${pageSize}`,
    method: 'GET',
    accessToken,
    errorPrefix: 'Failed to fetch products',
  })

  if (result && typeof result === 'object') {
    const response = result as ApiResponse<Product>
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

export async function searchProducts(
  baseUrl: string,
  accessToken: string,
  query: string,
  pageNumber: number = 1,
  pageSize: number = 15,
): Promise<PaginatedResponse<Product>> {
  const result = await apiRequest({
    baseUrl,
    path: `/products/search`,
    method: 'POST',
    body: {
      name: query,
      pagination: { pageNumber, pageSize },
    },
    accessToken,
    errorPrefix: 'Failed to search products',
  })

  if (result && typeof result === 'object') {
    const response = result as ApiResponse<Product>
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
