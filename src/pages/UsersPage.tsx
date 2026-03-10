import { ReactElement } from 'react'
import GenericListPage, { PaginatedResponse } from '../components/GenericListPage'
import { User, fetchUsers, searchUsers } from '../services/usersApi'

interface UsersPageProps {
  baseUrl: string
  accessToken: string
}

function UsersPage({ baseUrl, accessToken }: UsersPageProps): ReactElement {
  const fetchData = (baseUrl: string, accessToken: string, page: number, pageSize: number): Promise<PaginatedResponse<User>> =>
    fetchUsers(baseUrl, accessToken, page, pageSize)

  return (
    <GenericListPage
      title="Users"
      baseUrl={baseUrl}
      accessToken={accessToken}
      fetchData={fetchData}
      displayFields={['firstName', 'lastName', 'email']}

    />
  )
}

export default UsersPage
