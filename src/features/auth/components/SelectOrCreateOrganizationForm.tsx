import { RobotoButton, RobotoTypography } from "@/components"
import { RobotoLogo } from "@/components"
import { useAuth } from "@/providers"
import { useNavigationService } from "@/service"
import { Organization } from "@/service/apiService"
import { AnalyticsEvent } from "@/types"
import { Paper, useTheme } from "@mui/material"
import React from "react"

import { AuthCard } from "./AuthCard"

const buttonWidth = 275

interface SelectOrCreateOrganizationFormProps {
  isVisible: boolean
  currentOrganizations: Organization[] | null
  createNewOrganizationClicked: (individualAccountIdentifier: string) => void
}

export const SelectOrCreateOrganizationForm: React.FC<
  SelectOrCreateOrganizationFormProps
> = ({ isVisible, currentOrganizations, createNewOrganizationClicked }) => {
  const theme = useTheme()

  const { getUserIdToken } = useAuth()

  if (!isVisible) return null

  return (
    <AuthCard>
      <RobotoLogo />

      <RobotoTypography
        sx={{
          marginBottom: theme.spacing(2),
          textAlign: "center",
        }}
        variant="body1"
      >
        Choose your organization or create a new one:
      </RobotoTypography>

      <OrganizationsList organizations={currentOrganizations} />

      <RobotoButton
        eventName={AnalyticsEvent.CreateNewOrganizationClicked}
        variant={"contained"}
        sx={{ width: buttonWidth, marginBottom: theme.spacing(1) }}
        onClick={async () => {
          const userIdToken = await getUserIdToken()
          let individualAccountIdentifier = userIdToken?.email

          if (!individualAccountIdentifier) {
            individualAccountIdentifier = (
              new Date().getTime() / 1000
            ).toString()
          }

          createNewOrganizationClicked(individualAccountIdentifier)
        }}
      >
        Create new organization
      </RobotoButton>
    </AuthCard>
  )
}

interface OrganizationsListProps {
  organizations: Organization[] | null
}

const OrganizationsList: React.FC<OrganizationsListProps> = ({
  organizations,
}) => {
  //

  const theme = useTheme()

  const { goToHome } = useNavigationService()

  const { setCurrentOrganization } = useAuth()

  if (!organizations || organizations.length === 0) return null

  return (
    <>
      {organizations.map((orgRole) => {
        return (
          <Paper
            key={orgRole.org_id}
            elevation={2}
            sx={{
              padding: theme.spacing(1),
              display: "flex",
              flexDirection: "column",
              width: buttonWidth,
              marginBottom: theme.spacing(2),
              cursor: "pointer",
            }}
            onClick={() => {
              setCurrentOrganization(orgRole)
              goToHome()
            }}
          >
            <RobotoTypography variant="body2" sx={{ textAlign: "center" }}>
              <span style={{ fontWeight: 500 }}>{orgRole.name}</span> (
              {orgRole.members} member
              {orgRole.members > 1 && "s"})
            </RobotoTypography>
          </Paper>
        )
      })}
    </>
  )
}
