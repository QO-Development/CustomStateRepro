import { RobotoButton, RobotoTypography } from "@/components"
import { RobotoLogo } from "@/components"
import { useAuth } from "@/providers"
import { LoggerService } from "@/service"
import { useURLService } from "@/service"
import { AnalyticsEvent } from "@/types"
import { Box, CircularProgress, Divider, TextField } from "@mui/material"
import { useTheme } from "@mui/material"
import Link from "next/link"
import React, { useState } from "react"

import { AuthCard } from "./AuthCard"
import GoogleOAuthButton from "./GoogleOAuthButton"

interface SignUpFormProps {
  isVisible: boolean
  continueWithEmailClicked: (emailAddress: string, password: string) => void
  inviteId?: string
}

const buttonWidth = 275

export const SignUpForm: React.FC<SignUpFormProps> = ({
  isVisible,
  continueWithEmailClicked,
  inviteId,
}) => {
  const [showEmailInput, setShowEmailInput] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [errMsg, setErrMsg] = useState<string>("")

  const theme = useTheme()

  const { signUp } = useAuth()

  if (!isVisible) return null

  const clearErrMsg = () => {
    setErrMsg("")
  }

  if (loading) {
    return (
      <SignUpCard>
        <CircularProgress />
      </SignUpCard>
    )
  }

  return (
    <SignUpCard inviteId={inviteId}>
      <GoogleOAuthButton
        buttonWidth={buttonWidth}
        marginBottom={theme.spacing(2)}
        signUp={true}
        onClick={() => {
          clearErrMsg()
        }}
      />

      {showEmailInput ? (
        <EmailInput
          continueWithEmailClicked={async (email, password) => {
            setLoading(true)
            clearErrMsg()

            const errMsg = await signUp(email, password)

            if (errMsg) {
              LoggerService.log("Error signing up: ", errMsg)
              setErrMsg(errMsg)
              setLoading(false)
              return
            }

            setLoading(false)

            continueWithEmailClicked(email, password)
          }}
        />
      ) : (
        <RobotoButton
          eventName={AnalyticsEvent.SignUpWithEmailClicked}
          variant="contained"
          sx={{ width: buttonWidth, marginBottom: theme.spacing(3) }}
          onClick={() => setShowEmailInput(true)}
        >
          Sign up with Email
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
    </SignUpCard>
  )
}

interface SignUpCardProps {
  children: React.ReactNode
  inviteId?: string
}

const SignUpCard: React.FC<SignUpCardProps> = ({ children, inviteId }) => {
  const theme = useTheme()

  const { generateSignInURL } = useURLService()

  return (
    <>
      <AuthCard>
        <RobotoLogo />
        {children}
      </AuthCard>
      <RobotoTypography
        variant={"caption"}
        textAlign={"center"}
        sx={{ marginTop: theme.spacing(2) }}
      >
        Already have an account? Sign in{" "}
        {inviteId ? (
          <Link href={generateSignInURL(inviteId)}>here</Link>
        ) : (
          <Link href={generateSignInURL()}>here</Link>
        )}
        .
      </RobotoTypography>
    </>
  )
}

interface EmailInputProps {
  continueWithEmailClicked: (email: string, password: string) => void
}

const EmailInput: React.FC<EmailInputProps> = ({
  continueWithEmailClicked,
}) => {
  const theme = useTheme()

  const [password, setPassword] = useState<string>("")
  const [email, setEmail] = useState<string>("")

  let buttonDisabled = true

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  buttonDisabled = !(password.length >= 8 && emailRegex.test(email))

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
          setEmail(e.target.value)
        }}
      />

      <TextField
        label="Password"
        type={"password"}
        sx={{ marginBottom: theme.spacing(2) }}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
        }}
      />
      <RobotoButton
        eventName={AnalyticsEvent.ContinueWithEmailClicked}
        variant={"contained"}
        sx={{ width: buttonWidth, marginBottom: theme.spacing(2) }}
        disabled={buttonDisabled}
        onClick={() => continueWithEmailClicked(email, password)}
      >
        Continue with email
      </RobotoButton>
    </Box>
  )
}
