import { RobotoAPICall, User } from "@/types"

export interface APIServiceInterface {
  authorizedRequest: (
    apiCall: RobotoAPICall,
  ) => Promise<{ response: unknown | null; error: Error | null }>
}

export type OrganizationRoleLevel = "user" | "admin" | "owner"

export type OrganizationType = "team" | "individual"

export type OrganizationTier = "free" | "premium"

export interface Organization {
  org_id: string
  name: string
  org_type: OrganizationType
  tier: OrganizationTier
  members: number
}

export interface OrganizationRole {
  user: User
  org: Organization
  roles: OrganizationRoleLevel[]
}

export interface TokenContext {
  token_id: string
  name: string
  expires: string // UTC ISO String
  last_used?: string // UTC ISO String
  description?: string
}

export interface Token {
  user_id: string
  secret?: string
  context: TokenContext
}

export interface Invite {
  invited_by: User
  org: Organization
  invite_id: string
  user_id: string
}

export interface CreateOrganizationResponse {
  data: Organization
}

export interface GetOrganizationsResponse {
  data: Organization[]
}

export interface GetTokensResponse {
  data: Token[]
}

export interface CreateTokenResponse {
  data: Token
}

export interface GetInviteResponse {
  data: Invite
}

export interface GetOrganizationRolesResponse {
  data: OrganizationRole[]
}

export interface GetOrganizationInvitesResponse {
  data: Invite[]
}
