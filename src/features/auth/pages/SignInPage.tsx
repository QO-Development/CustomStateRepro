import { useAuth } from "@/providers"
import { useNavigationService } from "@/service"
import { useLazyAPICall } from "@/service/apiHooks"
import { orgsInvitesEndpoint } from "@/types"
import { Box, Container } from "@mui/material"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

import {
  ConfigureOrganizationForm,
  ForgotPasswordForm,
  HowDoYouWorkForm,
  InviteTeamMembersForm,
  LoadOauthForm,
  ResetPasswordForm,
  SelectOrCreateOrganizationForm,
  SignInForm,
} from "../components"
import { SignInFormState } from "../types"

export const SignInPage: React.FC<{ inviteId?: string }> = ({ inviteId }) => {
  const router = useRouter()

  const isOAuthFlow = router.query.oauth

  const [formState, setFormState] = useState<SignInFormState>({
    currentSignInForm: isOAuthFlow ? "loadOauth" : "signIn",
    individualAccountIdentifier: "",
    emailAddress: "",
    workMode: "individual",
    currentOrganizations: null,
  })

  const { getCurrentOrganization } = useAuth()
  const { goToInvite, goToHome } = useNavigationService()

  const { initiateRequest: initiateInviteRequest } = useLazyAPICall()

  useEffect(() => {
    if (isOAuthFlow) {
      setFormState((prevState) => {
        return {
          ...prevState,
          currentSignInForm: "loadOauth",
        }
      })
    }
  }, [isOAuthFlow])

  return (
    <Container
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <SignInForm
          inviteId={inviteId}
          isVisible={formState.currentSignInForm === "signIn"}
          forgotPasswordClicked={() => {
            const newFormState: SignInFormState = {
              ...formState,
              currentSignInForm: "forgotPassword",
            }

            setFormState(newFormState)
          }}
          signInSuccess={(orgs) => {
            const inviteId = router.query.inviteId as string

            if (inviteId) {
              goToInvite(inviteId)
              return
            }

            const newFormState: SignInFormState = {
              ...formState,
              currentSignInForm: "selectOrCreateOrganization",
              currentOrganizations: orgs === null ? [] : orgs.data,
            }

            setFormState(newFormState)
          }}
        />

        <LoadOauthForm
          isVisible={formState.currentSignInForm === "loadOauth"}
          loadOrgsSuccess={(orgs, inviteId) => {
            if (inviteId) {
              goToInvite(inviteId)
              return
            }

            const newFormState: SignInFormState = {
              ...formState,
              currentSignInForm: "selectOrCreateOrganization",
              currentOrganizations: orgs === null ? [] : orgs.data,
            }

            setFormState(newFormState)
          }}
        />

        <SelectOrCreateOrganizationForm
          isVisible={
            formState.currentSignInForm === "selectOrCreateOrganization"
          }
          currentOrganizations={formState.currentOrganizations}
          createNewOrganizationClicked={(individualAccountIdentifier) => {
            const newFormState: SignInFormState = {
              ...formState,
              currentSignInForm: "howDoYouWork",
              individualAccountIdentifier: individualAccountIdentifier,
            }

            setFormState(newFormState)
          }}
        />

        <HowDoYouWorkForm
          individualAccountIdentifier={formState.individualAccountIdentifier}
          isVisible={formState.currentSignInForm === "howDoYouWork"}
          goBackPressed={() => {
            setFormState({
              ...formState,
              currentSignInForm: "selectOrCreateOrganization",
            })
          }}
          continueClicked={(workMode) => {
            const newFormState: SignInFormState = {
              ...formState,
              currentSignInForm: "configureOrganization",
              workMode: workMode,
            }

            setFormState(newFormState)
          }}
        />

        <ConfigureOrganizationForm
          isVisible={formState.currentSignInForm === "configureOrganization"}
          onSuccess={(allowEmailDomain: boolean, organizationName: string) => {
            const newFormState: SignInFormState = {
              ...formState,
              currentSignInForm: "inviteTeamMembers",
              allowEmailDomainToJoinOrg: allowEmailDomain,
              organizationName: organizationName,
            }

            setFormState(newFormState)
          }}
          goBackPressed={() =>
            setFormState({ ...formState, currentSignInForm: "howDoYouWork" })
          }
          formState={formState}
        />

        <InviteTeamMembersForm
          isVisible={formState.currentSignInForm === "inviteTeamMembers"}
          organizationName={formState.organizationName}
          inviteAndCompletePressed={(emailAddresses) => {
            emailAddresses.forEach((emailAddress) => {
              initiateInviteRequest({
                endpoint: orgsInvitesEndpoint,
                method: "POST",
                requestBody: JSON.stringify({
                  invited_user_id: emailAddress,
                }),
                orgId: getCurrentOrganization()?.org_id,
              })
            })

            goToHome()
          }}
          skipForNowPressed={() => {
            goToHome()
          }}
        />

        <ForgotPasswordForm
          isVisible={formState.currentSignInForm === "forgotPassword"}
          onSuccess={async (emailAddress) => {
            const newFormState: SignInFormState = {
              ...formState,
              currentSignInForm: "resetPassword",
              emailAddress: emailAddress,
            }

            setFormState(newFormState)
          }}
          goBackClicked={() => {
            const newFormState: SignInFormState = {
              ...formState,
              currentSignInForm: "signIn",
            }

            setFormState(newFormState)
          }}
        />
        <ResetPasswordForm
          isVisible={formState.currentSignInForm === "resetPassword"}
          emailAddress={formState.emailAddress}
          goBackClicked={() => {
            const newFormState: SignInFormState = {
              ...formState,
              currentSignInForm: "forgotPassword",
            }

            setFormState(newFormState)
          }}
        />
      </Box>
    </Container>
  )
}
