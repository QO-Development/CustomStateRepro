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
