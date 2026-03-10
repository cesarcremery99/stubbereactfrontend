import { ReactElement } from 'react'
import GenericListPage, { PaginatedResponse } from '../components/GenericListPage'
import { Language, fetchLanguages, searchLanguages } from '../services/languagesApi'

interface LanguagesPageProps {
  baseUrl: string
  accessToken: string
}

function LanguagesPage({ baseUrl, accessToken }: LanguagesPageProps): ReactElement {
  const fetchData = (baseUrl: string, accessToken: string, page: number, pageSize: number): Promise<PaginatedResponse<Language>> =>
    fetchLanguages(baseUrl, accessToken, page, pageSize)
  
  const searchData = (baseUrl: string, accessToken: string, query: string, page: number, pageSize: number): Promise<PaginatedResponse<Language>> =>
    searchLanguages(baseUrl, accessToken, query, page, pageSize)

  return (
    <GenericListPage
      title="Languages"
      baseUrl={baseUrl}
      accessToken={accessToken}
      fetchData={fetchData}
      searchData={searchData}
      displayFields={['name', 'code']}
    />
  )
}

export default LanguagesPage
