import { ReactElement, useState } from 'react'

interface MenuItem {
  label: string
  path?: string
  children?: MenuItem[]
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Facilities', path: '/facilities' },
  { label: 'Countries', path: '/countries' },
  {
    label: 'Language Management',
    children: [
      { label: 'Languages', path: '/languages' },
      { label: 'Language Values', path: '/language-values' },
    ],
  },
  { label: 'Products', path: '/products' },
  { label: 'Production Lines', path: '/production-lines' },
  { label: 'Users', path: '/users' },
  { label: 'Navision Products', path: '/navision-products' },
]

interface SidebarProps {
  currentPath: string
  onNavigate: (path: string) => void
  loggedIn: boolean
  email: string
  role?: string
  darkMode: boolean
  onToggleDarkMode: () => void
  onDashboard: () => void
  onLogin: () => void
  onLogout: () => void
}

function Sidebar({
  currentPath,
  onNavigate,
  loggedIn,
  email,
  role = 'Administrator',
  darkMode,
  onToggleDarkMode,
  onDashboard,
  onLogout,
}: SidebarProps): ReactElement {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(label)) {
      newExpanded.delete(label)
    } else {
      newExpanded.add(label)
    }
    setExpandedItems(newExpanded)
  }

  const isChildActive = (item: MenuItem): boolean => {
    if (item.children) {
      return item.children.some(
        (child) => child.path === currentPath || isChildActive(child)
      )
    }
    return item.path === currentPath
  }

  const initials = email
    .split('@')[0]
    .split('.')
    .map((part) => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2) || 'U'

  const userName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

  if (!loggedIn) return <></>

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 overflow-y-auto shadow-sm flex flex-col">
      {/* Profile Section */}
      <div className="p-5 border-b border-gray-300 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 text-white font-bold text-sm shadow-md flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{userName}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{role}</div>
          </div>
          <button
            className="bg-transparent border-none p-1 cursor-pointer flex-shrink-0 transition-all duration-200"
            type="button"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            title="Profile menu"
            aria-label="Profile menu"
          >
            <span className="text-lg text-gray-600 dark:text-gray-400 hover:text-blue-500">⋮</span>
          </button>
        </div>

        {profileMenuOpen && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden mb-3">
            <button
              className="w-full px-3 py-2 bg-transparent border-none text-left text-gray-900 dark:text-white font-medium cursor-pointer transition-all duration-200 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-blue-500"
              type="button"
              onClick={() => {
                onDashboard()
                setProfileMenuOpen(false)
              }}
            >
              📊 Dashboard
            </button>

            <button
              className="w-full px-3 py-2 bg-transparent border-none text-left text-gray-900 dark:text-white font-medium cursor-pointer transition-all duration-200 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-blue-500"
              type="button"
              onClick={() => {
                onToggleDarkMode()
                setProfileMenuOpen(false)
              }}
            >
              {darkMode ? '☀️' : '🌙'} {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            <div className="h-px bg-gray-300 dark:bg-gray-600" />

            <button
              className="w-full px-3 py-2 bg-transparent border-none text-left text-red-600 font-medium cursor-pointer transition-all duration-200 text-sm flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-700 dark:hover:text-red-300"
              type="button"
              onClick={() => {
                onLogout()
                setProfileMenuOpen(false)
              }}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      {/* Navigation Section */}
      <nav className="p-5 flex-1 overflow-y-auto">
        <ul className="list-none m-0 p-0">
          {MENU_ITEMS.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <>
                  <button
                    className={`w-full px-3.5 py-3 mb-1.5 bg-transparent text-left font-medium text-sm cursor-pointer rounded-md transition-all duration-200 flex items-center justify-between ${
                      isChildActive(item)
                        ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-blue-500'
                    }`}
                    type="button"
                    onClick={() => toggleExpanded(item.label)}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`transition-transform duration-200 ${
                        expandedItems.has(item.label) ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  {expandedItems.has(item.label) && (
                    <ul className="list-none m-0 p-0 ml-4">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <button
                            className={`w-full px-3.5 py-2 mb-1 bg-transparent text-left font-medium text-sm cursor-pointer rounded-md transition-all duration-200 ${
                              currentPath === child.path
                                ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 font-semibold border-l-3 border-blue-500 pl-3'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-blue-500'
                            }`}
                            type="button"
                            onClick={() => onNavigate(child.path!)}
                          >
                            {child.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <button
                  className={`w-full px-3.5 py-3 mb-1.5 bg-transparent text-left font-medium text-sm cursor-pointer rounded-md transition-all duration-200 ${
                    currentPath === item.path
                      ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 font-semibold border-l-3 border-blue-500 pl-3'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-blue-500'
                  }`}
                  type="button"
                  onClick={() => onNavigate(item.path!)}
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
