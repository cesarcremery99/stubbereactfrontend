import { ReactElement } from 'react'
import GenericListPage, { PaginatedResponse } from '../components/GenericListPage'
import { LanguageValue, fetchLanguageValues, searchLanguageValues } from '../services/languageValuesApi'

interface LanguageValuesPageProps {
  baseUrl: string
  accessToken: string
}

function LanguageValuesPage({ baseUrl, accessToken }: LanguageValuesPageProps): ReactElement {
  const fetchData = (baseUrl: string, accessToken: string, page: number, pageSize: number): Promise<PaginatedResponse<LanguageValue>> =>
    fetchLanguageValues(baseUrl, accessToken, page, pageSize)

  return (
    <GenericListPage
      title="Language Values"
      baseUrl={baseUrl}
      accessToken={accessToken}
      fetchData={fetchData}
      displayFields={['key', 'value']}

    />
  )
}

export default LanguageValuesPage
