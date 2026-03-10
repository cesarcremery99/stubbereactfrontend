import { ReactElement } from 'react'
import GenericListPage, { PaginatedResponse } from '../components/GenericListPage'
import { ProductionLine, fetchProductionLines, searchProductionLines } from '../services/productionLinesApi'

interface ProductionLinesPageProps {
  baseUrl: string
  accessToken: string
}

function ProductionLinesPage({ baseUrl, accessToken }: ProductionLinesPageProps): ReactElement {
  const fetchData = (baseUrl: string, accessToken: string, page: number, pageSize: number): Promise<PaginatedResponse<ProductionLine>> =>
    fetchProductionLines(baseUrl, accessToken, page, pageSize)
  
  const searchData = (baseUrl: string, accessToken: string, query: string, page: number, pageSize: number): Promise<PaginatedResponse<ProductionLine>> =>
    searchProductionLines(baseUrl, accessToken, query, page, pageSize)

  return (
    <GenericListPage
      title="Production Lines"
      baseUrl={baseUrl}
      accessToken={accessToken}
      fetchData={fetchData}
      searchData={searchData}
      displayFields={['id', 'name']}
    />
  )
}

export default ProductionLinesPage
