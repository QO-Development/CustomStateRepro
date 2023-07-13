import { RobotoButton, RobotoTypography } from "@/components"
import { RobotoLogo } from "@/components"
import { useAuth } from "@/providers"
import { APIService } from "@/service"
import { useURLService } from "@/service"
import { GetOrganizationsResponse } from "@/service/apiService"
import { AnalyticsEvent, RobotoAPICall, usersOrgsEndpoint } from "@/types"
import { Box, CircularProgress, TextField } from "@mui/material"
import { useTheme } from "@mui/material"
import Link from "next/link"
import React, { useState } from "react"

import { AuthCard } from "./AuthCard"
import GoogleOAuthButton from "./GoogleOAuthButton"

const buttonWidth = 275

interface SignInFormProps {
  isVisible: boolean
  forgotPasswordClicked: () => void
  signInSuccess: (orgs: GetOrganizationsResponse | null) => void
  inviteId?: string
}

export const SignInForm: React.FC<SignInFormProps> = ({
  isVisible,
  forgotPasswordClicked,
  signInSuccess,
  inviteId,
}) => {
  const [showEmailInput, setShowEmailInput] = useState<boolean>(false)

  const theme = useTheme()

  const { generateSignUpURL } = useURLService()

  if (!isVisible) return null

  return (
    <>
      <AuthCard>
        <RobotoLogo />

        <GoogleOAuthButton
          signUp={false}
          buttonWidth={buttonWidth}
          marginBottom={theme.spacing(2)}
          onClick={() => {
            //clear an error message?
          }}
        />

        {showEmailInput ? (
          <EmailInput signInSuccess={signInSuccess} />
        ) : (
          <RobotoButton
            eventName={AnalyticsEvent.SignInWithEmailClicked}
            variant="contained"
            sx={{ width: buttonWidth, marginBottom: theme.spacing(2) }}
            onClick={() => setShowEmailInput(true)}
          >
            Sign in with Email
          </RobotoButton>
        )}

        <RobotoButton
          sx={{ width: buttonWidth, marginBottom: theme.spacing(3) }}
          variant={"text"}
          onClick={forgotPasswordClicked}
          eventName={AnalyticsEvent.ForgotPasswordClicked}
        >
          Forgot password?
        </RobotoButton>
      </AuthCard>
      <RobotoTypography
        variant={"caption"}
        textAlign={"center"}
        sx={{ marginTop: theme.spacing(2) }}
      >
        Need an account? Sign up{" "}
        {inviteId ? (
          <Link href={generateSignUpURL(inviteId)}>here</Link>
        ) : (
          <Link href={generateSignUpURL()}>here</Link>
        )}
      </RobotoTypography>
    </>
  )
}

interface EmailInputProps {
  signInSuccess: (orgs: GetOrganizationsResponse | null) => void
}

const EmailInput: React.FC<EmailInputProps> = ({ signInSuccess }) => {
  const theme = useTheme()

  const { signIn } = useAuth()

  const [password, setPassword] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [errMsg, setErrMsg] = useState<string>("")

  let buttonDisabled = true

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  buttonDisabled = !(password.length >= 8 && emailRegex.test(email))

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "300px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextField
          label="Email address"
          sx={{ marginBottom: theme.spacing(2) }}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setErrMsg("")
          }}
        />

        <TextField
          label="Password"
          type={"password"}
          sx={{ marginBottom: theme.spacing(2) }}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setErrMsg("")
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
          eventName={AnalyticsEvent.LogInClicked}
          variant={"contained"}
          sx={{ width: buttonWidth, marginBottom: theme.spacing(2) }}
          disabled={buttonDisabled}
          onClick={async () => {
            setLoading(true)

            const err = await signIn(email, password)

            if (err) {
              setErrMsg(err)
              setLoading(false)

              return
            }

            const apiCall: RobotoAPICall = {
              endpoint: usersOrgsEndpoint,
              method: "GET",
            }

            const { response, error } = await APIService.authorizedRequest(
              apiCall,
            )

            if (error) {
              setErrMsg(error.message)
              setLoading(false)
              return
            }

            signInSuccess(response as GetOrganizationsResponse)
          }}
        >
          Log in
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
