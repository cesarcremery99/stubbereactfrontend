import { apiRequest } from './apiClient'

interface LoginPayload {
  email: string
  password: string
}

interface RefreshTokenPayload {
  refreshToken: string
  userId: string
  accessToken: string
}

interface SessionData {
  userId: string
  accessToken: string
  refreshToken: string
  expiryDate: string
  isRevoked: boolean
}

interface LoginResponse {
  raw: unknown
  message: string
  sessionData: SessionData
}

interface RefreshTokenResponse {
  raw: unknown
  message: string
  sessionData: SessionData
}

function unwrapResponseBody(responseBody: unknown): unknown {
  if (!responseBody || typeof responseBody !== 'object') return responseBody
  const body = responseBody as Record<string, unknown>
  if (body.data && typeof body.data === 'object') return body.data
  return responseBody
}

function extractSessionData(responseBody: unknown): SessionData {
  if (!responseBody || typeof responseBody !== 'object') {
    return {
      userId: '',
      accessToken: '',
      refreshToken: '',
      expiryDate: '',
      isRevoked: false,
    }
  }

  const payload = unwrapResponseBody(responseBody) as Record<string, unknown>

  return {
    userId: (payload.userId || payload.id || '') as string,
    accessToken: (payload.accessToken || (payload.token as Record<string, unknown>)?.accessToken || '') as string,
    refreshToken: (payload.refreshToken || (payload.token as Record<string, unknown>)?.refreshToken || '') as string,
    expiryDate: (payload.expiryDate || payload.refreshTokenExpiry || (payload.token as Record<string, unknown>)?.expiryDate || '') as string,
    isRevoked: typeof payload.isRevoked === 'boolean' ? payload.isRevoked : false,
  }
}

export async function login(baseUrl: string, payload: LoginPayload): Promise<LoginResponse> {
  const result = await apiRequest({
    baseUrl,
    path: '/auth/login',
    method: 'POST',
    body: payload,
    errorPrefix: 'Login failed',
  })

  return {
    raw: result,
    message: (result as Record<string, unknown>)?.message as string || '',
    sessionData: extractSessionData(result),
  }
}

export async function refreshToken(baseUrl: string, payload: RefreshTokenPayload): Promise<RefreshTokenResponse> {
  const result = await apiRequest({
    baseUrl,
    path: '/auth/refresh-token',
    method: 'POST',
    accessToken: payload.accessToken,
    body: {
      refreshToken: payload.refreshToken,
      userId: payload.userId,
    },
    errorPrefix: 'Refresh failed',
  })

  return {
    raw: result,
    message: (result as Record<string, unknown>)?.message as string || '',
    sessionData: extractSessionData(result),
  }
}
