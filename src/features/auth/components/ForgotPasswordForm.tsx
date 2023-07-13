import { RobotoButton, RobotoTypography } from "@/components"
import { RobotoLogo } from "@/components"
import { useAuth } from "@/providers"
import { AnalyticsEvent } from "@/types"
import { Box, CircularProgress, Divider, TextField } from "@mui/material"
import { useTheme } from "@mui/material"
import Link from "next/link"
import React, { useState } from "react"

import { AuthCard } from "./AuthCard"

const buttonWidth = 275

interface ForgotPasswordFormProps {
  isVisible: boolean
  onSuccess: (emailAddress: string) => void
  goBackClicked: () => void
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  isVisible,
  onSuccess,
  goBackClicked,
}) => {
  const theme = useTheme()

  if (!isVisible) return null

  return (
    <>
      <AuthCard>
        <RobotoLogo />

        <RobotoTypography sx={{ marginBottom: theme.spacing(3) }} variant="h5">
          Find your account
        </RobotoTypography>

        <EmailInput onSuccess={onSuccess} goBackClicked={goBackClicked} />
      </AuthCard>
      <RobotoTypography
        variant={"caption"}
        textAlign={"center"}
        sx={{ marginTop: theme.spacing(2) }}
      >
        Need an account? Sign up <Link href={"/signup"}>here</Link>
      </RobotoTypography>
    </>
  )
}

interface EmailInputProps {
  onSuccess: (emailAddress: string) => void
  goBackClicked: () => void
}

const EmailInput: React.FC<EmailInputProps> = ({
  onSuccess,
  goBackClicked,
}) => {
  const theme = useTheme()

  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const { forgotPasswordInitiate } = useAuth()

  let buttonDisabled = true

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  buttonDisabled = !emailRegex.test(email)

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Divider />

      <TextField
        label="Email address"
        sx={{ marginBottom: theme.spacing(2) }}
        value={email}
        onChange={(e) => {
          setError(undefined)
          setEmail(e.target.value)
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

            const err = await forgotPasswordInitiate(email)

            if (err) {
              setError(err)
              setLoading(false)
              return
            }

            setLoading(false)
            onSuccess(email)
          }}
        >
          Continue
        </RobotoButton>
      )}

      {error && (
        <RobotoTypography variant={"caption"} textAlign={"center"}>
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
