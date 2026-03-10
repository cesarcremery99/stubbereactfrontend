import { ReactElement } from 'react'

interface MenuItem {
  label: string
  path: string
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Facilities', path: '/facilities' },
  { label: 'Countries', path: '/countries' },
  { label: 'Languages', path: '/languages' },
  { label: 'Products', path: '/products' },
  { label: 'Production Lines', path: '/production-lines' },
  { label: 'Users', path: '/users' },
  { label: 'Language Values', path: '/language-values' },
  { label: 'Navision Products', path: '/navision-products' },
]

interface SidebarProps {
  currentPath: string
  onNavigate: (path: string) => void
  loggedIn: boolean
}

function Sidebar({ currentPath, onNavigate, loggedIn }: SidebarProps): ReactElement {
  if (!loggedIn) return <></>

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-60 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 p-5 overflow-y-auto shadow-sm">
      <nav className="p-0">
        <ul className="list-none m-0 p-0">
          {MENU_ITEMS.map((item) => (
            <li key={item.path}>
              <button
                className={`w-full px-3.5 py-3 mb-1.5 bg-transparent text-left font-medium text-sm cursor-pointer rounded-md transition-all duration-200 ${
                  currentPath === item.path
                    ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 font-semibold border-l-3 border-blue-500 pl-3'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-blue-500'
                }`}
                type="button"
                onClick={() => onNavigate(item.path)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
