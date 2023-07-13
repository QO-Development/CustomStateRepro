import { RobotoButton, RobotoIconButton, RobotoTypography } from "@/components"
import { AnalyticsEvent } from "@/types"
import ClearIcon from "@mui/icons-material/Clear"
import { Box, CircularProgress, TextField, useTheme } from "@mui/material"
import React from "react"

import { AuthCard } from "./AuthCard"

interface InviteTeamMembersFormProps {
  isVisible: boolean
  settingsPage?: boolean
  inviteAndCompletePressed: (emailAddresses: string[]) => void
  skipForNowPressed: () => void
  organizationName: string | undefined
}

const buttonWidth = "250px"

export const InviteTeamMembersForm: React.FC<InviteTeamMembersFormProps> = ({
  isVisible,
  settingsPage,
  inviteAndCompletePressed,
  skipForNowPressed,
  organizationName,
}) => {
  const theme = useTheme()

  const [emailAddresses, setEmailAddresses] = React.useState<string[]>([""])
  const [loading, setLoading] = React.useState<boolean>(false)

  if (!isVisible) return null

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  let allEmailsValid = true

  for (let i = 0; i < emailAddresses.length; i++) {
    const isValid = emailRegex.test(emailAddresses[i])

    if (!isValid) {
      allEmailsValid = false
      break
    }
  }

  return (
    <>
      {!settingsPage && (
        <Box sx={{ minWidth: "350px", maxWidth: "575px" }}>
          <RobotoTypography
            variant="h5"
            sx={{ marginBottom: theme.spacing(2) }}
          >
            Invite team members to {organizationName}
          </RobotoTypography>
        </Box>
      )}

      <AuthCard settingsPage={settingsPage}>
        <RobotoTypography
          variant={!settingsPage ? "body1" : "body2"}
          sx={{ marginBottom: theme.spacing(2) }}
        >
          Add team members to your organization to collaborate
        </RobotoTypography>

        {emailAddresses.map((emailAddress, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginBottom: theme.spacing(2.5),
              }}
            >
              <TextField
                label={"Email address"}
                sx={{ width: "100%" }}
                value={emailAddresses[index]}
                onChange={(e) => {
                  const newEmailAddresses = [...emailAddresses]
                  newEmailAddresses[index] = e.target.value
                  setEmailAddresses(newEmailAddresses)
                }}
                size="small"
              />

              <RobotoIconButton
                eventName={AnalyticsEvent.InviteTeamMembersRemoveEmailClicked}
                sx={{ marginLeft: theme.spacing(1) }}
                onClick={() => {
                  const newEmailAddresses = [...emailAddresses]
                  newEmailAddresses.splice(index, 1)
                  setEmailAddresses(newEmailAddresses)
                }}
              >
                <ClearIcon fontSize="small" />
              </RobotoIconButton>
            </Box>
          )
        })}

        <Box sx={{ width: "100%" }}>
          <RobotoButton
            eventName={AnalyticsEvent.InviteTeamMembersAddEmailClicked}
            sx={{ marginLeft: "-5px" }}
            onClick={() => {
              const newEmailAddresses = [...emailAddresses]
              newEmailAddresses.push("")
              setEmailAddresses(newEmailAddresses)
            }}
          >
            + Add another email
          </RobotoButton>
        </Box>

        {loading ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <RobotoButton
              eventName={AnalyticsEvent.InviteAndCompleteClicked}
              disabled={!allEmailsValid || emailAddresses.length === 0}
              variant={"contained"}
              sx={{
                width: buttonWidth,
                marginTop: theme.spacing(2),
                marginBottom: theme.spacing(2),
              }}
              onClick={() => {
                inviteAndCompletePressed(emailAddresses)
                setEmailAddresses([""])
              }}
            >
              Invite
            </RobotoButton>

            {!settingsPage && (
              <RobotoButton
                eventName={AnalyticsEvent.SkipForNowClicked}
                variant={"contained"}
                sx={{ width: buttonWidth, marginBottom: theme.spacing(2) }}
                onClick={() => {
                  setLoading(true)
                  skipForNowPressed()
                }}
              >
                Skip for now
              </RobotoButton>
            )}
          </>
        )}
      </AuthCard>
    </>
  )
}
