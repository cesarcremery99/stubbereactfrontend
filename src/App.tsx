import { useEffect, useMemo, useState, ReactElement } from 'react'
import TopNav from './components/TopNav'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import FacilitiesPage from './pages/FacilitiesPage'
import CountriesPage from './pages/CountriesPage'
import LanguagesPage from './pages/LanguagesPage'
import ProductsPage from './pages/ProductsPage'
import ProductionLinesPage from './pages/ProductionLinesPage'
import UsersPage from './pages/UsersPage'
import LanguageValuesPage from './pages/LanguageValuesPage'
import NavisionProductsPage from './pages/NavisionProductsPage'
import { login, refreshToken } from './services/authApi'
import { clearSession, getSession, isLoggedIn, saveSession, Session } from './services/sessionStore'

const DEFAULT_API_URL = 'https://localhost:7046/api'

function App(): ReactElement {
  const [route, setRoute] = useState<string>(window.location.pathname || '/dashboard')
  const [baseUrl] = useState<string>(localStorage.getItem('authApiBaseUrl') || DEFAULT_API_URL)
  const [session, setSession] = useState<Session>(getSession())
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname || '/dashboard')
    window.addEventListener('popstate', onPopState)
    if (window.location.pathname === '/') {
      navigate('/dashboard', true)
    }
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  function toggleDarkMode(): void {
    setDarkMode((prev) => !prev)
  }

  const loggedIn = useMemo(() => isLoggedIn(session), [session])

  function navigate(path: string, replace = false): void {
    if (replace) {
      window.history.replaceState({}, '', path)
    } else {
      window.history.pushState({}, '', path)
    }
    setRoute(path)
  }

  function handleLogout(): void {
    clearSession()
    const nextSession = getSession()
    setSession(nextSession)
    navigate('/dashboard')
  }

  async function handleLogin({ email, password }: { email: string; password: string }): Promise<void> {
    try {
      const response = await login(baseUrl, { email, password })
      const nextSession = {
        ...session,
        ...response.sessionData,
        email,
        loginResponse: response.raw,
      }

      setSession(nextSession)
      saveSession(nextSession)
      navigate('/dashboard')
    } catch (error) {
      console.error('Login failed:', (error as Error).message)
    }
  }

  async function handleRefreshToken(): Promise<void> {
    if (!loggedIn) {
      return
    }

    try {
      const response = await refreshToken(baseUrl, {
        refreshToken: session.refreshToken,
        userId: session.userId,
        accessToken: session.accessToken,
      })

      const nextSession = {
        ...session,
        ...response.sessionData,
        refreshResponse: response.raw,
      }

      setSession(nextSession)
      saveSession(nextSession)
    } catch (error) {
      console.error('Refresh failed:', (error as Error).message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <TopNav
        loggedIn={loggedIn}
        email={session.email}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onDashboard={() => navigate('/dashboard')}
        onLogin={() => navigate('/login')}
        onLogout={handleLogout}
      />

      {loggedIn && <Sidebar currentPath={route} onNavigate={navigate} loggedIn={loggedIn} />}

      <main className={`flex-1 p-8 flex flex-col items-stretch w-full bg-gray-50 dark:bg-gray-950 ${loggedIn ? 'ml-60 w-[calc(100%-240px)]' : ''}`}>
        {route === '/login' ? (
          <LoginPage
            onSubmit={handleLogin}
          />
        ) : route === '/facilities' ? (
          <FacilitiesPage
            baseUrl={baseUrl}
            accessToken={session.accessToken}
          />
        ) : route === '/countries' ? (
          <CountriesPage
            baseUrl={baseUrl}
            accessToken={session.accessToken}
          />
        ) : route === '/languages' ? (
          <LanguagesPage
            baseUrl={baseUrl}
            accessToken={session.accessToken}
          />
        ) : route === '/products' ? (
          <ProductsPage
            baseUrl={baseUrl}
            accessToken={session.accessToken}
          />
        ) : route === '/production-lines' ? (
          <ProductionLinesPage
            baseUrl={baseUrl}
            accessToken={session.accessToken}
          />
        ) : route === '/users' ? (
          <UsersPage
            baseUrl={baseUrl}
            accessToken={session.accessToken}
          />
        ) : route === '/language-values' ? (
          <LanguageValuesPage
            baseUrl={baseUrl}
            accessToken={session.accessToken}
          />
        ) : route === '/navision-products' ? (
          <NavisionProductsPage
            baseUrl={baseUrl}
            accessToken={session.accessToken}
          />
        ) : (
          <DashboardPage
            session={session}
            loggedIn={loggedIn}
            onRefreshToken={handleRefreshToken}
          />
        )}
      </main>
    </div>
  )
}

export default App
