export interface Session {
  email: string
  userId: string
  accessToken: string
  refreshToken: string
  expiryDate: string
  isRevoked: boolean
  loginResponse: unknown
  refreshResponse: unknown
}

const storageKey = 'authAppSession'

const defaultSession: Session = {
  email: '',
  userId: '',
  accessToken: '',
  refreshToken: '',
  expiryDate: '',
  isRevoked: false,
  loginResponse: null,
  refreshResponse: null,
}

export function getSession(): Session {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return { ...defaultSession }
    return { ...defaultSession, ...JSON.parse(raw) }
  } catch {
    return { ...defaultSession }
  }
}

export function saveSession(session: Session): void {
  localStorage.setItem(storageKey, JSON.stringify(session))
}

export function clearSession(): void {
  localStorage.removeItem(storageKey)
}

export function isLoggedIn(session: Session): boolean {
  return Boolean(session?.email)
}

export function maskToken(token: string): string {
  if (!token) return ''
  if (token.length <= 10) return token
  return `${token.slice(0, 6)}...${token.slice(-4)}`
}
