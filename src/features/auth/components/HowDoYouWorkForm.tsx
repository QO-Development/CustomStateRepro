import { RobotoButton, RobotoTypography } from "@/components"
import { useAuth } from "@/providers"
import { useNavigationService } from "@/service"
import { useLazyAPICall } from "@/service/apiHooks"
import { CreateOrganizationResponse, Organization } from "@/service/apiService"
import { AnalyticsEvent } from "@/types"
import { RobotoAPICall, orgsEndpoint } from "@/types"
import {
  Box,
  Checkbox,
  CircularProgress,
  Container,
  Paper,
  useTheme,
} from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import React, { useState } from "react"

interface HowDoYouWorkFormProps {
  isVisible: boolean
  continueClicked: (workMode: "individual" | "team") => void
  goBackPressed: () => void
  individualAccountIdentifier: string
}

export const HowDoYouWorkForm: React.FC<HowDoYouWorkFormProps> = ({
  isVisible,
  continueClicked,
  goBackPressed,
  individualAccountIdentifier,
}) => {
  const theme = useTheme()

  const { goToHome } = useNavigationService()

  const [selectedMode, setSelectedMode] = useState<
    "team" | "individual" | undefined
  >(undefined)

  const individualOrgName = "Individual - " + individualAccountIdentifier

  const createOrgAPICall: RobotoAPICall = {
    endpoint: orgsEndpoint,
    method: "POST",
    requestBody: JSON.stringify({
      name: individualOrgName,
      org_type: "individual",
    }),
  }

  const {
    error,
    data: orgData,
    loading,
    initiateRequest,
  } = useLazyAPICall<CreateOrganizationResponse>()

  const { setCurrentOrganization } = useAuth()

  if (!isVisible) return null

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "space-between",
        minWidth: "300px",
      }}
    >
      <Box>
        <RobotoTypography variant="h5" sx={{ marginBottom: theme.spacing(2) }}>
          How do you work?
        </RobotoTypography>
        <RobotoTypography variant="body1">
          Let us know how you plan to use Roboto, so we can better help you set
          up your account.
        </RobotoTypography>
      </Box>

      <Grid
        container
        sx={{ marginTop: theme.spacing(4), marginBottom: theme.spacing(4) }}
      >
        <Grid xs={12} md={6}>
          <WorkStyleCard
            mode={"team"}
            selected={selectedMode === "team"}
            workStyleSelected={() => {
              setSelectedMode("team")
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <WorkStyleCard
            mode={"individual"}
            selected={selectedMode === "individual"}
            workStyleSelected={() => {
              setSelectedMode("individual")
            }}
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {loading ? (
          <CircularProgress sx={{ marginBottom: theme.spacing(2) }} />
        ) : (
          <RobotoButton
            eventName={AnalyticsEvent.HowDoYouWorkContinueClicked}
            disabled={selectedMode === undefined || loading}
            variant="contained"
            sx={{
              width: { xs: "100%", md: "50%" },
              marginRight: theme.spacing(2),
              marginBottom: theme.spacing(2),
            }}
            onClick={async () => {
              if (selectedMode === "individual") {
                const { error } = await initiateRequest(createOrgAPICall)

                if (!error) {
                  setCurrentOrganization(orgData?.data as Organization)
                  goToHome()
                }

                return
              }

              continueClicked(selectedMode as "individual" | "team")
            }}
          >
            Continue
          </RobotoButton>
        )}

        {error && (
          <RobotoTypography
            variant={"caption"}
            textAlign={"center"}
            sx={{ color: theme.palette.error.main }}
          >
            {error.message}
          </RobotoTypography>
        )}

        <RobotoButton
          eventName={AnalyticsEvent.HowDoYouWorkGoBackPressed}
          sx={{
            width: { xs: "100%", md: "50%" },
            marginRight: theme.spacing(2),
          }}
          onClick={goBackPressed}
        >
          Go back a step
        </RobotoButton>
      </Box>
    </Container>
  )
}

interface WorkStyleCardProps {
  mode: "team" | "individual"
  selected: boolean
  workStyleSelected: () => void
}

const WorkStyleCard: React.FC<WorkStyleCardProps> = ({
  mode,
  selected,
  workStyleSelected,
}) => {
  const theme = useTheme()

  const headerText = mode === "team" ? "Team" : "Individual"
  const subtitleText = mode === "team" ? "I work with a team" : "I work alone"

  return (
    <Paper
      sx={{
        padding: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <RobotoTypography variant="h6">{headerText}</RobotoTypography>
      <RobotoTypography variant="body1">{subtitleText}</RobotoTypography>
      <Checkbox checked={selected} onChange={workStyleSelected} />
    </Paper>
  )
}
