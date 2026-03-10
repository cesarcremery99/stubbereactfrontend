import { ReactElement } from 'react'
import GenericListPage, { PaginatedResponse } from '../components/GenericListPage'
import { Country, fetchCountries, searchCountries } from '../services/countriesApi'

interface CountriesPageProps {
  baseUrl: string
  accessToken: string
}

function CountriesPage({ baseUrl, accessToken }: CountriesPageProps): ReactElement {
  const fetchData = (baseUrl: string, accessToken: string, page: number, pageSize: number): Promise<PaginatedResponse<Country>> =>
    fetchCountries(baseUrl, accessToken, page, pageSize)
  
  const searchData = (baseUrl: string, accessToken: string, query: string, page: number, pageSize: number): Promise<PaginatedResponse<Country>> =>
    searchCountries(baseUrl, accessToken, query, page, pageSize)

  return (
    <GenericListPage
      title="Countries"
      baseUrl={baseUrl}
      accessToken={accessToken}
      fetchData={fetchData}
      searchData={searchData}
      displayFields={['name', 'code']}
    />
  )
}

export default CountriesPage
