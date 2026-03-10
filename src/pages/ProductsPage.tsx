import { ReactElement } from 'react'
import GenericListPage, { PaginatedResponse } from '../components/GenericListPage'
import { Product, fetchProducts, searchProducts } from '../services/productsApi'

interface ProductsPageProps {
  baseUrl: string
  accessToken: string
}

function ProductsPage({ baseUrl, accessToken }: ProductsPageProps): ReactElement {
  const fetchData = (baseUrl: string, accessToken: string, page: number, pageSize: number): Promise<PaginatedResponse<Product>> =>
    fetchProducts(baseUrl, accessToken, page, pageSize)
  
  const searchData = (baseUrl: string, accessToken: string, query: string, page: number, pageSize: number): Promise<PaginatedResponse<Product>> =>
    searchProducts(baseUrl, accessToken, query, page, pageSize)

  return (
    <GenericListPage
      title="Products"
      baseUrl={baseUrl}
      accessToken={accessToken}
      fetchData={fetchData}
      searchData={searchData}
      displayFields={['id', 'name']}
    />
  )
}

export default ProductsPage
