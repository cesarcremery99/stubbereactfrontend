function parseJsonSafe(response: Response): Promise<unknown> {
  return response.text().then((text) => {
    if (!text) return null
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  })
}

function stringify(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

export function normalizeBaseUrl(baseUrl: string): string {
  const normalized = (baseUrl || '').trim().replace(/\/$/, '')
  if (!normalized) {
    throw new Error('Please enter API base URL first.')
  }

  const withoutSwaggerIndex = normalized.replace(/\/swagger\/index\.html$/i, '')
  const withoutSwaggerRoot = withoutSwaggerIndex.replace(/\/swagger$/i, '')
  return withoutSwaggerRoot
}

export function ensureApiSuccess(result: unknown, fallbackMessage: string): void {
  if (!result || typeof result !== 'object') return
  const apiResult = result as Record<string, unknown>
  if (typeof apiResult.success === 'boolean' && !apiResult.success) {
    const validation = Array.isArray(apiResult.validationErrors) ? apiResult.validationErrors.join(', ') : ''
    const errors = Array.isArray(apiResult.errors) ? apiResult.errors.join(', ') : ''
    const message = [apiResult.message, validation, errors].filter(Boolean).join(' | ')
    throw new Error(message || fallbackMessage)
  }
}

interface ApiRequestParams {
  baseUrl: string
  path: string
  method?: string
  body?: unknown
  accessToken?: string
  errorPrefix?: string
}

export async function apiRequest({
  baseUrl,
  path,
  method = 'GET',
  body,
  accessToken,
  errorPrefix = 'Request failed.',
}: ApiRequestParams): Promise<unknown> {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(`${normalizedBaseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const result = await parseJsonSafe(response)

  if (!response.ok) {
    throw new Error(`${errorPrefix} (${response.status}): ${stringify(result)}`)
  }

  ensureApiSuccess(result, errorPrefix)
  return result
}
