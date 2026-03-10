import { ReactElement, useEffect, useState } from 'react'

export interface PaginatedResponse<T> {
  pageNumber: number
  pageSize: number
  totalPages: number
  totalItemCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  items: T[]
}

interface GenericListPageProps<T> {
  title: string
  baseUrl: string
  accessToken: string
  fetchData: (baseUrl: string, accessToken: string, page: number, pageSize: number) => Promise<PaginatedResponse<T>>
  searchData?: (baseUrl: string, accessToken: string, query: string, page: number, pageSize: number) => Promise<PaginatedResponse<T>>
  displayFields: string[]
}

function GenericListPage<T extends Record<string, unknown>>({
  title,
  baseUrl,
  accessToken,
  fetchData,
  searchData,
  displayFields,
}: GenericListPageProps<T>): ReactElement {
  const [pageData, setPageData] = useState<PaginatedResponse<T> | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(15)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    async function loadData(): Promise<void> {
      try {
        setLoading(true)
        let data: PaginatedResponse<T>
        if (isSearching && searchQuery && searchData) {
          data = await searchData(baseUrl, accessToken, searchQuery, currentPage, pageSize)
        } else {
          data = await fetchData(baseUrl, accessToken, currentPage, pageSize)
        }
        setPageData(data)
      } catch (error) {
        console.error(`Failed to load ${title}:`, error)
      } finally {
        setLoading(false)
      }
    }

    if (accessToken) {
      loadData()
    }
  }, [baseUrl, accessToken, currentPage, pageSize, title, fetchData, searchData, searchQuery, isSearching])

  function handleSearch(query: string): void {
    setSearchQuery(query)
    setCurrentPage(1)
    if (query) {
      setIsSearching(true)
    } else {
      setIsSearching(false)
    }
  }

  function handleNextPage(): void {
    if (pageData?.hasNextPage) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  function handlePreviousPage(): void {
    if (pageData?.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  function getDisplayValue(item: T, field: string): string {
    const value = item[field]
    if (value === null || value === undefined) return '—'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    return String(value)
  }

  return (
    <section className="w-full p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm">
      <header className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white m-0">{title}</h1>
          {pageData && (
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Page {pageData.pageNumber} of {pageData.totalPages} ({pageData.totalItemCount} total)
            </div>
          )}
        </div>
        {searchData && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-3 py-2.5 transition-all duration-200 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearch('')}
                className="px-4 py-2.5 rounded-md font-semibold cursor-pointer transition-all duration-200 border-none text-sm bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </header>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400 m-0 mb-6 text-sm">Loading {title.toLowerCase()}...</p>
      ) : !pageData || pageData.items.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 m-0 mb-6 text-sm">No {title.toLowerCase()} found.</p>
      ) : (
        <>
          <div className="w-full overflow-x-auto rounded-lg my-5">
            <table className="w-full border-collapse bg-white dark:bg-gray-800 text-sm">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-100 dark:from-gray-900 dark:to-gray-900 border-b-2 border-gray-300 dark:border-gray-700">
                <tr>
                  {displayFields.map((field) => (
                    <th key={field} className="px-4 py-3.5 text-left font-bold text-gray-900 dark:text-white whitespace-nowrap select-none text-xs uppercase tracking-wide">
                      {field}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageData.items.map((item, index) => (
                  <tr key={`${index}`} className="border-b border-gray-300 dark:border-gray-700 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-900 shadow-inner">
                    {displayFields.map((field) => (
                      <td key={field} className="px-4 py-3 text-gray-900 dark:text-white max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                        {getDisplayValue(item, field)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
            <button
              className="w-auto px-4 py-2.5 min-w-[120px] bg-teal-600 text-white hover:bg-teal-700 hover:shadow-md rounded-md font-semibold cursor-pointer transition-all duration-200 border-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              onClick={handlePreviousPage}
              disabled={!pageData.hasPreviousPage}
            >
              ← Previous
            </button>
            <span className="font-semibold text-gray-600 dark:text-gray-400 min-w-[80px] text-center">
              Page {pageData.pageNumber} / {pageData.totalPages}
            </span>
            <button
              className="w-auto px-4 py-2.5 min-w-[120px] bg-teal-600 text-white hover:bg-teal-700 hover:shadow-md rounded-md font-semibold cursor-pointer transition-all duration-200 border-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              onClick={handleNextPage}
              disabled={!pageData.hasNextPage}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default GenericListPage
