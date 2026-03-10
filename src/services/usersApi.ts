import { apiRequest } from './apiClient'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
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

export async function fetchUsers(
  baseUrl: string,
  accessToken: string,
  pageNumber: number = 1,
  pageSize: number = 15,
): Promise<PaginatedResponse<User>> {
  const result = await apiRequest({
    baseUrl,
    path: `/management/users/all?PageNumber=${pageNumber}&PageSize=${pageSize}`,
    method: 'GET',
    accessToken,
    errorPrefix: 'Failed to fetch users',
  })

  if (result && typeof result === 'object') {
    const response = result as ApiResponse<User>
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

export async function searchUsers(
  baseUrl: string,
  accessToken: string,
  query: string,
  pageNumber: number = 1,
  pageSize: number = 15,
): Promise<PaginatedResponse<User>> {
  const result = await apiRequest({
    baseUrl,
    path: `/management/users/search`,
    method: 'POST',
    body: {
      userName: query,
      email: query,
      pagination: { pageNumber, pageSize },
    },
    accessToken,
    errorPrefix: 'Failed to search users',
  })

  if (result && typeof result === 'object') {
    const response = result as ApiResponse<User>
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
