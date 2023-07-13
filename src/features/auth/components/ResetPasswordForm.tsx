import { RobotoButton, RobotoTypography } from "@/components"
import { RobotoLogo } from "@/components"
import { useAuth } from "@/providers"
import { useNavigationService } from "@/service"
import { AnalyticsEvent } from "@/types"
import { Box, CircularProgress, TextField } from "@mui/material"
import { useTheme } from "@mui/material"
import React, { useState } from "react"

import { AuthCard } from "./AuthCard"

const buttonWidth = 275

interface ResetPasswordFormProps {
  isVisible: boolean
  emailAddress: string
  goBackClicked: () => void
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  isVisible,
  emailAddress,
  goBackClicked,
}) => {
  const theme = useTheme()

  if (!isVisible) return null

  return (
    <AuthCard>
      <RobotoLogo />

      <RobotoTypography sx={{ marginBottom: theme.spacing(4) }} variant="h4">
        Reset Password
      </RobotoTypography>

      <ResetInput emailAddress={emailAddress} goBackClicked={goBackClicked} />
    </AuthCard>
  )
}

interface ResetInputProps {
  emailAddress: string
  goBackClicked: () => void
}

const ResetInput: React.FC<ResetInputProps> = ({
  emailAddress,
  goBackClicked,
}) => {
  const theme = useTheme()

  const [code, setCode] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [resendLoading, setResendLoading] = useState<boolean>(false)

  const { forgotPasswordComplete, signIn, forgotPasswordInitiate } = useAuth()

  const { goToSignIn, goToHome } = useNavigationService()

  const buttonDisabled = code.length != 6 || newPassword.length < 8

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TextField
        label="Verification code"
        type="tel"
        sx={{ marginBottom: theme.spacing(2) }}
        value={code}
        onChange={(e) => {
          setError(undefined)
          setCode(e.target.value)
        }}
      />

      <TextField
        label="New password"
        type="password"
        sx={{ marginBottom: theme.spacing(2) }}
        value={newPassword}
        onChange={(e) => {
          setError(undefined)
          setNewPassword(e.target.value)
        }}
      />

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
          eventName={AnalyticsEvent.ForgotPasswordContinueClicked}
          variant={"contained"}
          sx={{ width: buttonWidth, marginBottom: theme.spacing(2) }}
          disabled={buttonDisabled}
          onClick={async () => {
            setLoading(true)

            const err = await forgotPasswordComplete(
              emailAddress,
              code,
              newPassword,
            )

            if (err) {
              setError(err)
              setLoading(false)
              return
            }

            const signInErr = await signIn(emailAddress, newPassword)

            if (signInErr) {
              // password has been reset, but sign in failed. best to redirect to login at this point and let the user try again
              goToSignIn()
              return
            } else {
              goToHome()
            }
          }}
        >
          Continue
        </RobotoButton>
      )}

      {resendLoading ? (
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
          eventName={AnalyticsEvent.ForgotPasswordResendLinkClicked}
          sx={{ marginBottom: theme.spacing(1) }}
          variant={"text"}
          onClick={async () => {
            setResendLoading(true)

            await forgotPasswordInitiate(emailAddress)

            setResendLoading(false)
          }}
        >
          Resend link
        </RobotoButton>
      )}

      {error && (
        <RobotoTypography
          variant={"caption"}
          textAlign={"center"}
          sx={{
            color: theme.palette.error.main,
            marginBottom: theme.spacing(2),
          }}
        >
          {error}
        </RobotoTypography>
      )}

      <RobotoButton
        eventName={AnalyticsEvent.ForgotPasswordBackClicked}
        variant={"text"}
        sx={{ width: buttonWidth, marginBottom: theme.spacing(2) }}
        onClick={goBackClicked}
      >
        Go back
      </RobotoButton>
    </Box>
  )
}
