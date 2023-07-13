import { RobotoLogo } from "@/components"
import { useTheme } from "@mui/material"
import React from "react"

import { AuthCard } from "./AuthCard"
import GoogleOAuthButton from "./GoogleOAuthButton"

const buttonWidth = 275

interface SignInFormProps {
  isVisible: boolean
}

export const SignInForm: React.FC<SignInFormProps> = ({ isVisible }) => {
  const theme = useTheme()

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
      </AuthCard>
    </>
  )
}
