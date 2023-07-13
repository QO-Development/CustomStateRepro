import { RobotoButton, RobotoTypography } from "@/components"
import { RobotoLogo } from "@/components"
import { Organization } from "@/service/apiService"
import { AnalyticsEvent } from "@/types"
import { Box, CircularProgress, Divider, TextField } from "@mui/material"
import { useTheme } from "@mui/material"
import { useRouter } from "next/router"
import React, { useState } from "react"

import { useSubmitVerification } from "../api"
import { CurrentSignUpForm } from "../types"
import { AuthCard } from "./AuthCard"

const buttonWidth = 275

interface VerificationCodeFormProps {
  isVisible: boolean
  onCodeSuccess: (
    nextForm: CurrentSignUpForm,
    organizations: Organization[] | null,
    inviteId: string | null,
  ) => void
  emailAddress: string
  password: string
}

export const VerificationCodeForm: React.FC<VerificationCodeFormProps> = ({
  onCodeSuccess,
  emailAddress,
  isVisible,
  password,
}) => {
  const theme = useTheme()

  if (!isVisible) return null

  return (
    <AuthCard>
      <RobotoLogo />

      <RobotoTypography
        sx={{
          marginBottom: theme.spacing(4),
        }}
        variant="h5"
      >
        Verify your email
      </RobotoTypography>

      <RobotoTypography
        sx={{
          marginBottom: theme.spacing(2),
          textAlign: "center",
        }}
        variant="body1"
      >
        Please enter the code we sent to your email address
      </RobotoTypography>

      <CodeInput
        codeSuccess={onCodeSuccess}
        emailAddress={emailAddress}
        password={password}
      />
    </AuthCard>
  )
}

interface CodeInputProps {
  emailAddress: string
  password: string
  codeSuccess: (
    nextForm: CurrentSignUpForm,
    organizations: Organization[] | null,
    inviteId: string | null,
  ) => void
}

const CodeInput: React.FC<CodeInputProps> = ({
  codeSuccess,
  emailAddress,
  password,
}) => {
  const theme = useTheme()

  const [code, setCode] = useState<string>("")

  const router = useRouter()

  const { loading, errMsg, submitVerification, clearErrMsg } =
    useSubmitVerification()

  let buttonDisabled = true

  if (code.length === 6) {
    buttonDisabled = false
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Divider />

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextField
          label="Verification Code"
          type="tel"
          sx={{ marginBottom: theme.spacing(2) }}
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            clearErrMsg()
          }}
        />
      </Box>

      {loading ? (
        <Box
          sx={{
            width: buttonWidth,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: theme.spacing(2),
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <RobotoButton
          eventName={AnalyticsEvent.SubmitVerificationCodeClicked}
          variant={"contained"}
          sx={{ width: buttonWidth, marginBottom: theme.spacing(2) }}
          disabled={buttonDisabled}
          onClick={async () => {
            const { organizations, errMsg } = await submitVerification(
              emailAddress,
              code,
              password,
            )

            if (errMsg) {
              //errMsg is handled above
              return
            } else {
              const inviteId = router.query.inviteId as string

              if (inviteId) {
                // user will be pushed to invite page in success handler
                codeSuccess("howDoYouWork", null, inviteId)
              } else if (organizations && organizations.data.length > 0) {
                //need to navigate to SelectOrCreateOrganizationForm
                codeSuccess(
                  "selectOrCreateOrganization",
                  organizations.data,
                  null,
                )
              } else {
                //need to navigate to HowDoYouWorkForm
                codeSuccess("howDoYouWork", null, null)
              }
            }
          }}
        >
          Submit
        </RobotoButton>
      )}

      {errMsg && (
        <RobotoTypography
          variant={"caption"}
          textAlign={"center"}
          sx={{ color: theme.palette.error.main }}
        >
          {errMsg}
        </RobotoTypography>
      )}
    </Box>
  )
}
