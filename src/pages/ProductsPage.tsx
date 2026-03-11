import { ReactElement, useEffect, useState } from 'react'
import { Product, PaginatedResponse, ProductFilters, fetchProducts, filterProducts } from '../services/productsApi'
import { Country, fetchCountriesReference } from '../services/countriesApi'

interface ProductsPageProps {
  baseUrl: string
  accessToken: string
}

function ProductsPage({ baseUrl, accessToken }: ProductsPageProps): ReactElement {
  const [pageData, setPageData] = useState<PaginatedResponse<Product> | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(15)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<ProductFilters>({})
  const [appliedFilters, setAppliedFilters] = useState<ProductFilters>({})
  const [hasFilters, setHasFilters] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])

  useEffect(() => {
    async function loadCountries(): Promise<void> {
      try {
        const data = await fetchCountriesReference(baseUrl, accessToken)
        setCountries(data)
      } catch (error) {
        console.error('Failed to load countries:', error)
      }
    }

    if (accessToken) {
      loadCountries()
    }
  }, [baseUrl, accessToken])

  useEffect(() => {
    async function loadData(): Promise<void> {
      try {
        setLoading(true)
        let data: PaginatedResponse<Product>
        if (hasFilters) {
          data = await filterProducts(baseUrl, accessToken, appliedFilters, currentPage, pageSize)
        } else {
          data = await fetchProducts(baseUrl, accessToken, currentPage, pageSize)
        }
        setPageData(data)
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }

    if (accessToken) {
      loadData()
    }
  }, [baseUrl, accessToken, currentPage, pageSize, appliedFilters, hasFilters])

  function handleFilterChange(key: keyof ProductFilters, value: string | number | boolean): void {
    setFilters((prev) => ({
      ...prev,
      [key]: value === '' ? '' : value,
    }))
  }

  function handleFilterSubmit(): void {
    setCurrentPage(1)
    setAppliedFilters(filters)
    setHasFilters(true)
  }

  function handleClearFilters(): void {
    setFilters({})
    setAppliedFilters({})
    setHasFilters(false)
    setCurrentPage(1)
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

  function getDisplayValue(value: unknown): string {
    if (value === null || value === undefined) return '—'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    return String(value)
  }

  return (
    <section className="w-full p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm">
      <header className="mb-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white m-0">Products</h1>
          {pageData && (
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Page {pageData.pageNumber} of {pageData.totalPages} ({pageData.totalItemCount} total)
            </div>
          )}
        </div>
      </header>

      <div className="w-full overflow-x-auto rounded-lg my-5">
        <table className="w-full border-collapse bg-white dark:bg-gray-800 text-sm">
          <thead>
            {/* Header Row */}
            <tr className="bg-gradient-to-r from-gray-100 to-gray-100 dark:from-gray-900 dark:to-gray-900 border-b-2 border-gray-300 dark:border-gray-700">
              <th className="px-4 py-3.5 text-left font-bold text-gray-900 dark:text-white whitespace-nowrap select-none text-xs uppercase tracking-wide">ID</th>
              <th className="px-4 py-3.5 text-left font-bold text-gray-900 dark:text-white whitespace-nowrap select-none text-xs uppercase tracking-wide">Name</th>
              <th className="px-4 py-3.5 text-left font-bold text-gray-900 dark:text-white whitespace-nowrap select-none text-xs uppercase tracking-wide">Description</th>
              <th className="px-4 py-3.5 text-left font-bold text-gray-900 dark:text-white whitespace-nowrap select-none text-xs uppercase tracking-wide">Facility</th>
              <th className="px-4 py-3.5 text-left font-bold text-gray-900 dark:text-white whitespace-nowrap select-none text-xs uppercase tracking-wide">Country</th>
              <th className="px-4 py-3.5 text-left font-bold text-gray-900 dark:text-white whitespace-nowrap select-none text-xs uppercase tracking-wide">Blocked for Prod.</th>
              <th className="px-4 py-3.5 text-left font-bold text-gray-900 dark:text-white whitespace-nowrap select-none text-xs uppercase tracking-wide">Free for Prod.</th>
              <th className="px-4 py-3.5 text-left font-bold text-gray-900 dark:text-white whitespace-nowrap select-none text-xs uppercase tracking-wide">Mixed Product</th>
            </tr>

            {/* Filter Row */}
            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-300 dark:border-gray-700">
              <th className="px-4 py-2.5 text-left">
                <input
                  type="number"
                  value={filters.id || ''}
                  onChange={(e) => handleFilterChange('id', e.target.value ? parseInt(e.target.value) : '')}
                  placeholder="Search ID"
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-2.5 py-1.5 text-xs transition-all duration-200"
                />
              </th>
              <th className="px-4 py-2.5 text-left">
                <input
                  type="text"
                  value={filters.name || ''}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  placeholder="Search Name"
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-2.5 py-1.5 text-xs transition-all duration-200"
                />
              </th>
              <th className="px-4 py-2.5 text-left">
                <input
                  type="text"
                  value={filters.description || ''}
                  onChange={(e) => handleFilterChange('description', e.target.value)}
                  placeholder="Search Description"
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-2.5 py-1.5 text-xs transition-all duration-200"
                />
              </th>
              <th className="px-4 py-2.5 text-left">
                <input
                  type="number"
                  value={filters.facilityId || ''}
                  onChange={(e) => handleFilterChange('facilityId', e.target.value ? parseInt(e.target.value) : '')}
                  placeholder="Facility ID"
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-2.5 py-1.5 text-xs transition-all duration-200"
                />
              </th>
              <th className="px-4 py-2.5 text-left">
                <select
                  value={filters.countryId || ''}
                  onChange={(e) => handleFilterChange('countryId', e.target.value ? parseInt(e.target.value) : '')}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-2.5 py-1.5 text-xs transition-all duration-200"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </th>
              <th className="px-4 py-2.5 text-left">
                <select
                  value={filters.isBlockedForProduction === '' ? '' : String(filters.isBlockedForProduction)}
                  onChange={(e) => handleFilterChange('isBlockedForProduction', e.target.value === '' ? '' : e.target.value === 'true')}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-2.5 py-1.5 text-xs transition-all duration-200"
                >
                  <option value="">Any</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </th>
              <th className="px-4 py-2.5 text-left">
                <select
                  value={filters.freeForProduction === '' ? '' : String(filters.freeForProduction)}
                  onChange={(e) => handleFilterChange('freeForProduction', e.target.value === '' ? '' : e.target.value === 'true')}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-2.5 py-1.5 text-xs transition-all duration-200"
                >
                  <option value="">Any</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </th>
              <th className="px-4 py-2.5 text-left">
                <div className="flex gap-1">
                  <select
                    value={filters.isMixedProduct === '' ? '' : String(filters.isMixedProduct)}
                    onChange={(e) => handleFilterChange('isMixedProduct', e.target.value === '' ? '' : e.target.value === 'true')}
                    className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-2.5 py-1.5 text-xs transition-all duration-200"
                  >
                    <option value="">Any</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleFilterSubmit}
                    className="px-3 py-1.5 rounded-md font-semibold cursor-pointer transition-all duration-200 border-none text-xs bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 whitespace-nowrap"
                  >
                    Search
                  </button>
                  {hasFilters && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="px-3 py-1.5 rounded-md font-semibold cursor-pointer transition-all duration-200 border-none text-xs bg-gray-400 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-500 dark:hover:bg-gray-600 whitespace-nowrap"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-600 dark:text-gray-400">
                  Loading products...
                </td>
              </tr>
            ) : !pageData || pageData.items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-600 dark:text-gray-400">
                  No products found.
                </td>
              </tr>
            ) : (
              pageData.items.map((item, index) => (
                <tr key={`${index}`} className="border-b border-gray-300 dark:border-gray-700 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-900 shadow-inner">
                  <td className="px-4 py-3 text-gray-900 dark:text-white max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{getDisplayValue(item.id)}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{getDisplayValue(item.name)}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{getDisplayValue(item.description)}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{getDisplayValue(item.facilityName)}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{getDisplayValue(item.countryName)}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{getDisplayValue(item.isBlockedForProduction)}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{getDisplayValue(item.freeForProduction)}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{getDisplayValue(item.isMixedProduct)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pageData && (
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
      )}
    </section>
  )
}

export default ProductsPage
