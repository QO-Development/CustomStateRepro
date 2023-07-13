export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "OPTIONS"

/*

Problems with using strings for API Routes: 

1. No type safety. If you change the route, you have to change it everywhere.
2. No autocomplete. You have to remember the route.
3. Code is very error prone. If you misspell the route, or the route changes, you won't know until runtime. 
4. API routes are changing very quickly as we develop the API. Routes can change out from underneath us as we go. 
We need to be able to change the routes in one place, and have the changes reflected everywhere.

*/

export type RobotoEndpoint = (
  params?: Record<string, string | number>,
) => string

export const usersOrgsEndpoint: RobotoEndpoint = () => `/users/orgs`

export const orgsEndpoint: RobotoEndpoint = () => `/orgs`

export const orgsRolesEndpoint: RobotoEndpoint = () => `/orgs/roles`

export const orgsUsersEndpoint: RobotoEndpoint = () => `/orgs/users`

export const orgsInvitesEndpoint: RobotoEndpoint = () => `/orgs/invites`

export const datasetsEndpoint: RobotoEndpoint = () => {
  return `/datasets`
}

export const datasetFilesEndpoint: RobotoEndpoint = (pathParams) => {
  const datasetId = pathParams?.datasetId

  return `/datasets/${datasetId}/files`
}

export const datasetsQueryEndpoint: RobotoEndpoint = () => {
  return `/datasets/query`
}

export const tokensEndpoint: RobotoEndpoint = () => `/tokens`

export const tokenByIdEndpoint: RobotoEndpoint = (pathParams) => {
  const tokenId = pathParams?.tokenId

  if (!tokenId) {
    throw Error("Token by ID Endpoint requires a tokenId")
  }

  return `/tokens/${tokenId}`
}

export const inviteEndpoint: RobotoEndpoint = (params) => {
  const inviteId = params?.inviteId

  if (!inviteId) {
    throw Error("Invite endpoints require an inviteId")
  }

  return `/orgs/invites/${inviteId}`
}

export const acceptInviteEndpoint: RobotoEndpoint = (params) => {
  const inviteId = params?.inviteId

  if (!inviteId) {
    throw Error("Invite endpoints require an inviteId")
  }

  return `/orgs/invites/${inviteId}/accept`
}

export const declineInviteEndpoint: RobotoEndpoint = (params) => {
  const inviteId = params?.inviteId

  if (!inviteId) {
    throw Error("Invite endpoints require an inviteId")
  }

  return `/orgs/invites/${inviteId}/decline`
}

export const usersEndpoint: RobotoEndpoint = () => `/users`

export interface CallState<ResponseData> {
  loading: boolean
  error: APIServiceError | null
  data: ResponseData | null
}

export interface APIServiceError extends Error {
  route?: string
}

export interface RobotoAPICall {
  endpoint: RobotoEndpoint
  method: HTTPMethod
  requestBody?: BodyInit
  queryParams?: URLSearchParams
  pathParams?: Record<string, string | number>
  orgId?: string
  headers?: Record<string, string>
  isNotAuthenticated?: boolean
}

// Note: These two interfaces are the same, but I think we'll see it's probably a bad idea
// to use the same interface for both the filter type and the object type
export interface DatasetsFilter {
  administrator?: string
  created?: string //'2023-06-30T20:10:55.529607+00:00',
  created_by?: string //'example@roboto.ai',
  dataset_id?: string //'49de1d91ec7d4bafa73042c3014e2614',
  metadata?: { [key: string]: unknown } // {'key1': 'val1', 'key2': 2, 'key3': False, 'key4': ['item2', 'item3']},
  modified?: string //'2023-06-30T20:10:55.529607+00:00',
  modified_by?: string //'example@roboto.ai',
  org_id?: string //'ce69b3709cad4e15b28ca8fd8a248ddf',
  storage_location?: string //'S3',
  tags?: string[] //['tag2']
}

export interface Dataset {
  administrator?: string
  created?: string //'2023-06-30T20:10:55.529607+00:00',
  created_by?: string //'example@roboto.ai',
  dataset_id?: string //'49de1d91ec7d4bafa73042c3014e2614',
  metadata?: { [key: string]: unknown } // {'key1': 'val1', 'key2': 2, 'key3': False, 'key4': ['item2', 'item3']},
  modified?: string //'2023-06-30T20:10:55.529607+00:00',
  modified_by?: string //'example@roboto.ai',
  org_id?: string //'ce69b3709cad4e15b28ca8fd8a248ddf',
  storage_location?: string //'S3',
  tags?: string[] //['tag2']
}

export interface DatasetsQueryResponse {
  data: {
    items: DatasetsFilter[]
    next_token?: {
      dataset_id: string
      org_id: string
    }
  }
}

export interface DatasetFile {
  association_id: string
  modified: string
  org_id: string
  relative_path: string
  size: number
  uri: string
}

export interface DatasetFilesQueryResponse {
  data: {
    items: DatasetFile[]
    next_token?: {
      uri: string
      association_id: string
    }
  }
}
