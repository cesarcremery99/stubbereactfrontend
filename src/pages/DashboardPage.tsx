import { ReactElement } from 'react'
import { maskToken, Session } from '../services/sessionStore'

interface DashboardPageProps {
  session: Session
  loggedIn: boolean
  onRefreshToken: () => void
}

function DashboardPage({ session, loggedIn, onRefreshToken }: DashboardPageProps): ReactElement {
  const welcome = loggedIn
    ? `Welcome back, ${session.email}!`
    : 'Welcome! Please login to start using the app.'

  return (
    <section className="w-full p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm">
      <header className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white m-0">Dashboard</h1>
      </header>

      <p className="text-xl font-bold text-gray-900 dark:text-white mt-0 mb-3">{welcome}</p>

      {loggedIn ? (
        <>
          <div className="mb-2">
            <button className="bg-teal-600 text-white hover:bg-teal-700 hover:shadow-md rounded-md font-semibold cursor-pointer transition-all duration-200 border-none text-sm px-4 py-2.5 w-full" type="button" onClick={onRefreshToken}>
              Refresh Token
            </button>
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">Session</h2>
          <pre className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-3 overflow-x-auto text-gray-900 dark:text-white text-sm font-mono">
            {JSON.stringify(
              {
                email: session.email,
                userId: session.userId,
                accessToken: maskToken(session.accessToken),
                refreshToken: maskToken(session.refreshToken),
                expiryDate: session.expiryDate,
                isRevoked: Boolean(session.isRevoked),
              },
              null,
              2,
            )}
          </pre>
        </>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 m-0 mb-6 text-sm">This dashboard is the home of your application.</p>
      )}
    </section>
  )
}

export default DashboardPage
