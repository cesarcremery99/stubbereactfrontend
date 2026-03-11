import { ReactElement, useState } from 'react'

interface MenuItem {
  label: string
  path?: string
  children?: MenuItem[]
  color?: 'teal' | 'blue' | 'default'
}

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    children: [
      { label: 'Productionlines', path: '/production-lines' },
      { label: 'Facilities', path: '/facilities' },
      { label: 'Countries', path: '/countries' },
    ],
  },
  { label: 'Fixing station', path: '/fixing-station', color: 'teal' },
  { label: 'Shipping station', path: '/shipping-station', color: 'blue' },
  { label: 'Shipping station New', path: '/shipping-station-new', color: 'blue' },
  {
    label: 'Facility management',
    children: [{ label: 'Facilities', path: '/facilities' }],
  },
  {
    label: 'Worker management',
    children: [],
  },
  {
    label: 'Debug management',
    children: [],
  },
  {
    label: 'Internal label management',
    children: [],
  },
  {
    label: 'Label management',
    children: [],
  },
  { label: 'Users', path: '/users' },
  {
    label: 'Language management',
    children: [
      { label: 'Languages', path: '/languages' },
      { label: 'Language Values', path: '/language-values' },
    ],
  },
  {
    label: 'Codeproviders',
    children: [],
  },
  {
    label: 'Trace management',
    children: [],
  },
  { label: 'Shipping orders', path: '/shipping-orders', color: 'teal' },
  { label: 'Navision database', path: '/navision-products', color: 'teal' },
  {
    label: 'Transfer management',
    children: [],
  },
]

interface SidebarProps {
  currentPath: string
  onNavigate: (path: string) => void
  loggedIn: boolean
  email: string
  role?: string
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
    if (item.children && item.children.length > 0) {
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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#2f4050] border-r border-[#1c2a33] overflow-y-auto flex flex-col shadow-lg">
      {/* Profile Section */}
      <div className="nav-header p-6 border-b border-[#1c2a33] flex-shrink-0">
        <div className="text-center mb-2">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 text-white font-bold text-lg shadow-lg mx-auto mb-3">
            {initials}
          </div>
          <div className="text-sm font-semibold text-white">{userName}</div>
          <div className="text-xs text-[#8095a8]">{role}</div>
        </div>

        {/* Profile Menu */}
        {profileMenuOpen && (
          <div className="mt-3 pt-3 border-t border-[#1c2a33]">
            <button
              className="w-full px-3 py-2 bg-[#293846] text-left text-[#DFE4ED] font-medium cursor-pointer transition-all duration-200 text-sm rounded flex items-center gap-2 hover:bg-[#1ab394] hover:text-white mb-2"
              type="button"
              onClick={() => {
                onDashboard()
                setProfileMenuOpen(false)
              }}
            >
              📊 Dashboard
            </button>

            <button
              className="w-full px-3 py-2 bg-[#293846] text-left text-red-400 font-medium cursor-pointer transition-all duration-200 text-sm rounded flex items-center gap-2 hover:bg-red-600 hover:text-white"
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

        {!profileMenuOpen && (
          <button
            className="w-full mt-2 py-1 text-xs text-[#8095a8] bg-transparent border-none cursor-pointer hover:text-white transition-colors"
            type="button"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          >
            ⋮ Menu
          </button>
        )}
      </div>

      {/* Navigation Section */}
      <nav className="p-0 flex-1 overflow-y-auto">
        <ul className="list-none m-0 p-0">
          {MENU_ITEMS.map((item) => {
            const getColorClasses = (color?: 'teal' | 'blue' | 'default') => {
              if (color === 'teal') return 'bg-[#1ab394] text-white hover:bg-[#17987e]'
              if (color === 'blue') return 'bg-[#1582c1] text-white hover:bg-[#196896]'
              return 'text-[#a7b1c2] hover:bg-[#293846] hover:text-white'
            }

            return (
              <li key={item.label}>
                {item.children && item.children.length > 0 ? (
                  <>
                    <button
                      className={`w-full px-5 py-3 bg-transparent text-left font-semibold text-sm cursor-pointer transition-all duration-200 flex items-center justify-between border-l-4 border-transparent ${
                        isChildActive(item)
                          ? 'bg-[#293846] text-white border-l-4 border-[#1ab394]'
                          : 'text-[#a7b1c2] hover:bg-[#293846] hover:text-white'
                      }`}
                      type="button"
                      onClick={() => toggleExpanded(item.label)}
                    >
                      <span>{item.label}</span>
                      <span className="text-xs">›</span>
                    </button>
                    {expandedItems.has(item.label) && (
                      <ul className="list-none m-0 p-0 bg-[#293846]">
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <button
                              className={`w-full px-8 py-2 bg-transparent text-left font-medium text-xs cursor-pointer transition-all duration-200 border-l-4 border-transparent ${
                                currentPath === child.path
                                  ? 'bg-[#1ab394] text-white border-l-4 border-[#1ab394]'
                                  : 'text-[#a7b1c2] hover:bg-[#1ab394]/20 hover:text-white'
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
                    className={`w-full px-5 py-3 bg-transparent text-left font-semibold text-sm cursor-pointer transition-all duration-200 flex items-center justify-between ${
                      currentPath === item.path && !item.children
                        ? 'bg-[#293846] text-white border-l-4 border-[#1ab394]'
                        : getColorClasses(item.color)
                    } ${item.color ? '' : 'border-l-4 border-transparent'}`}
                    type="button"
                    onClick={() => onNavigate(item.path!)}
                  >
                    <span>{item.label}</span>
                    {item.children && item.children.length === 0 && <span className="text-xs">›</span>}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
