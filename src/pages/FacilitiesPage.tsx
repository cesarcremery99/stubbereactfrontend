import { ReactElement, useEffect, useState } from 'react'
import { Facility, PaginatedResponse, fetchFacilities, searchFacilities } from '../services/facilitiesApi'

interface FacilitiesPageProps {
  baseUrl: string
  accessToken: string
}

function FacilitiesPage({ baseUrl, accessToken }: FacilitiesPageProps): ReactElement {
  const [pageData, setPageData] = useState<PaginatedResponse | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(15)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    async function loadFacilities(): Promise<void> {
      try {
        setLoading(true)
        let data: PaginatedResponse
        if (isSearching && searchQuery) {
          data = await searchFacilities(baseUrl, accessToken, searchQuery, currentPage, pageSize)
        } else {
          data = await fetchFacilities(baseUrl, accessToken, currentPage, pageSize)
        }
        setPageData(data)
      } catch (error) {
        console.error('Failed to load facilities:', error)
      } finally {
        setLoading(false)
      }
    }

    if (accessToken) {
      loadFacilities()
    }
  }, [baseUrl, accessToken, currentPage, pageSize, searchQuery, isSearching])

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

  function handleSearch(query: string): void {
    setSearchQuery(query)
    setCurrentPage(1)
    if (query) {
      setIsSearching(true)
    } else {
      setIsSearching(false)
    }
  }

  return (
    <section className="w-full p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm">
      <header className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white m-0">Facilities</h1>
          {pageData && (
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Page {pageData.pageNumber} of {pageData.totalPages} ({pageData.totalItemCount} total)
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search facilities..."
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
      </header>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400 m-0 mb-6 text-sm">Loading facilities...</p>
      ) : !pageData || pageData.items.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 m-0 mb-6 text-sm">No facilities found.</p>
      ) : (
        <>
          <div className="flex flex-col gap-4 mt-5">
            {pageData.items.map((facility) => (
              <div key={facility.id} className="p-5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="m-0 font-semibold text-gray-900 dark:text-white flex-1">{facility.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-md text-sm font-semibold ${
                    facility.enabled 
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
                      : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
                  }`}>
                    {facility.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  {facility.address && <p className="m-0 text-gray-600 dark:text-gray-400"><strong className="text-gray-900 dark:text-white">Address:</strong> {facility.address}</p>}
                  {facility.city && <p className="m-0 text-gray-600 dark:text-gray-400"><strong className="text-gray-900 dark:text-white">City:</strong> {facility.city} {facility.zipCode ? `(${facility.zipCode})` : ''}</p>}
                  {facility.country && <p className="m-0 text-gray-600 dark:text-gray-400"><strong className="text-gray-900 dark:text-white">Country:</strong> {facility.country}</p>}
                  {facility.email && <p className="m-0 text-gray-600 dark:text-gray-400"><strong className="text-gray-900 dark:text-white">Email:</strong> {facility.email}</p>}
                  {facility.tel && <p className="m-0 text-gray-600 dark:text-gray-400"><strong className="text-gray-900 dark:text-white">Phone:</strong> {facility.tel}</p>}
                  {facility.vat && <p className="m-0 text-gray-600 dark:text-gray-400"><strong className="text-gray-900 dark:text-white">VAT:</strong> {facility.vat}</p>}
                </div>
              </div>
            ))}
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

export default FacilitiesPage
