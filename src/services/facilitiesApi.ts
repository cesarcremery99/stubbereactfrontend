import { apiRequest } from './apiClient'

export interface Facility {
  id: number
  name: string
  address: string | null
  zipCode: string | null
  city: string | null
  country: string | null
  countryCode: string | null
  vat: string | null
  tel: string | null
  email: string | null
  prefix: string | null
  enabled: boolean
  serverMID: string | null
  euFacilityIdentifier: string | null
  facilityType: number
}

export interface PaginatedResponse {
  pageNumber: number
  pageSize: number
  totalPages: number
  totalItemCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  items: Facility[]
}

export interface FacilitiesApiResponse {
  success: boolean
  message: string
  data: PaginatedResponse
  errors: unknown[]
}

export async function fetchFacilities(
  baseUrl: string,
  accessToken: string,
  pageNumber: number = 1,
  pageSize: number = 15,
): Promise<PaginatedResponse> {
  const result = await apiRequest({
    baseUrl,
    path: `/facilities/all?PageNumber=${pageNumber}&PageSize=${pageSize}`,
    method: 'GET',
    accessToken,
    errorPrefix: 'Failed to fetch facilities',
  })

  if (result && typeof result === 'object') {
    const response = result as FacilitiesApiResponse
    if (response.data) {
      return response.data as PaginatedResponse
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

export async function searchFacilities(
  baseUrl: string,
  accessToken: string,
  query: string,
  pageNumber: number = 1,
  pageSize: number = 15,
): Promise<PaginatedResponse> {
  const result = await apiRequest({
    baseUrl,
    path: `/facilities/search`,
    method: 'POST',
    body: {
      name: query,
      pagination: { pageNumber, pageSize },
    },
    accessToken,
    errorPrefix: 'Failed to search facilities',
  })

  if (result && typeof result === 'object') {
    const response = result as FacilitiesApiResponse
    if (response.data) {
      return response.data as PaginatedResponse
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
