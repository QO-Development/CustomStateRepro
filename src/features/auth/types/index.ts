import { Organization } from "@/service/apiService"

export type CurrentSignUpForm =
  | "signUp"
  | "verificationCode"
  | "howDoYouWork"
  | "configureOrganization"
  | "inviteTeamMembers"
  | "selectOrCreateOrganization"

export type CurrentSignInForm =
  | "signIn"
  | "forgotPassword"
  | "resetPassword"
  | "selectOrCreateOrganization"
  | "howDoYouWork"
  | "configureOrganization"
  | "inviteTeamMembers"
  | "loadOauth"

type WorkMode = "individual" | "team"

export interface SignUpFormState {
  currentSignUpForm: CurrentSignUpForm
  emailAddress: string
  individualAccountIdentifier: string
  password: string
  currentOrganizations: Organization[] | null
  workMode: WorkMode
  organizationName?: string
  allowEmailDomainToJoinOrg?: boolean
  teamMemberEmails?: string[]
}

export interface SignInFormState {
  currentSignInForm: CurrentSignInForm
  emailAddress: string
  individualAccountIdentifier: string
  workMode: WorkMode
  currentOrganizations: Organization[] | null
  organizationName?: string
  allowEmailDomainToJoinOrg?: boolean
  teamMemberEmails?: string[]
}
