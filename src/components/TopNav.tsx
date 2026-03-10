import { ReactElement, useState } from 'react'

interface TopNavProps {
  loggedIn: boolean
  email: string
  darkMode: boolean
  onToggleDarkMode: () => void
  onDashboard: () => void
  onLogin: () => void
  onLogout: () => void
}

function TopNav({ loggedIn, email, darkMode, onToggleDarkMode, onDashboard, onLogin, onLogout }: TopNavProps): ReactElement {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  function handleAvatarClick(): void {
    setDropdownOpen((prev) => !prev)
  }

  function handleMenuItemClick(callback: () => void): void {
    callback()
    setDropdownOpen(false)
  }

  const initials = email
    .split('@')[0]
    .split('.')
    .map((part) => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2) || 'U'

  return (
    <nav className="w-full bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 px-6 shadow-sm sticky top-0 z-100 flex justify-center h-16 items-center">
      <div className="flex items-center justify-between w-full h-full px-0">
        <div className="flex flex-col items-start gap-0.5 min-w-[200px]">
          <div className="font-black text-2xl text-blue-500 -tracking-0.5">Stubbe</div>
          <div className="text-xs text-gray-400 font-semibold -tracking-0.5 uppercase -tracking-1">Admin Dashboard</div>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-0 flex-1 justify-end">
          <div className="relative pr-4">
            <button
              className="bg-transparent border-none p-1 cursor-pointer flex items-center transition-all duration-200"
              type="button"
              onClick={handleAvatarClick}
              title={loggedIn ? email : 'Menu'}
              aria-label="User menu"
              aria-expanded={dropdownOpen}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 text-white font-bold text-sm relative shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                <span className="absolute">{initials}</span>
                {dropdownOpen && <span className="absolute text-lg opacity-100">⋮</span>}
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg min-w-[220px] z-[1000] overflow-hidden">
                {loggedIn && (
                  <>
                    <div className="px-4 py-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium break-all">{email}</span>
                    </div>
                    <div className="h-px bg-gray-300 dark:bg-gray-700" />
                  </>
                )}

                <button
                  className="w-full px-4 py-3 bg-transparent border-none text-left text-gray-900 dark:text-white font-medium cursor-pointer transition-all duration-200 text-sm font-normal flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-blue-500"
                  type="button"
                  onClick={() => handleMenuItemClick(onDashboard)}
                >
                  📊 Dashboard
                </button>

                <button
                  className="w-full px-4 py-3 bg-transparent border-none text-left text-gray-900 dark:text-white font-medium cursor-pointer transition-all duration-200 text-sm font-normal flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-blue-500"
                  type="button"
                  onClick={() => handleMenuItemClick(onToggleDarkMode)}
                >
                  {darkMode ? '☀️' : '🌙'} {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>

                <div className="h-px bg-gray-300 dark:bg-gray-700" />

                {loggedIn ? (
                  <button
                    className="w-full px-4 py-3 bg-transparent border-none text-left text-red-600 font-medium cursor-pointer transition-all duration-200 text-sm font-normal flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-700 dark:hover:text-red-300"
                    type="button"
                    onClick={() => handleMenuItemClick(onLogout)}
                  >
                    🚪 Logout
                  </button>
                ) : (
                  <button
                    className="w-full px-4 py-3 bg-transparent border-none text-left text-blue-500 font-medium cursor-pointer transition-all duration-200 text-sm font-normal flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600"
                    type="button"
                    onClick={() => handleMenuItemClick(onLogin)}
                  >
                    🔐 Login
                  </button>
                )}
              </div>
            )}

            {dropdownOpen && <div className="fixed inset-0 z-[999]" onClick={() => setDropdownOpen(false)} />}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default TopNav
