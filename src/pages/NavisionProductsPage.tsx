import { ReactElement } from 'react'
import GenericListPage, { PaginatedResponse } from '../components/GenericListPage'
import { NavisionProduct, fetchNavisionProducts, searchNavisionProducts } from '../services/navisionProductsApi'

interface NavisionProductsPageProps {
  baseUrl: string
  accessToken: string
}

function NavisionProductsPage({ baseUrl, accessToken }: NavisionProductsPageProps): ReactElement {
  const fetchData = (baseUrl: string, accessToken: string, page: number, pageSize: number): Promise<PaginatedResponse<NavisionProduct>> =>
    fetchNavisionProducts(baseUrl, accessToken, page, pageSize)
  
  const searchData = (baseUrl: string, accessToken: string, query: string, page: number, pageSize: number): Promise<PaginatedResponse<NavisionProduct>> =>
    searchNavisionProducts(baseUrl, accessToken, query, page, pageSize)

  return (
    <GenericListPage
      title="Navision Products"
      baseUrl={baseUrl}
      accessToken={accessToken}
      fetchData={fetchData}
      searchData={searchData}
      displayFields={['id', 'name']}
    />
  )
}

export default NavisionProductsPage
