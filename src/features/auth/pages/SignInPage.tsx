import { Box, Container } from "@mui/material"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

import { LoadOauthForm, SignInForm } from "../components"
import { SignInFormState } from "../types"

export const SignInPage: React.FC = () => {
  const router = useRouter()

  const isOAuthFlow = router.query.oauth

  const [formState, setFormState] = useState<SignInFormState>({
    currentSignInForm: isOAuthFlow ? "loadOauth" : "signIn",
    individualAccountIdentifier: "",
    emailAddress: "",
    workMode: "individual",
    currentOrganizations: null,
  })

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
        <SignInForm isVisible={formState.currentSignInForm === "signIn"} />

        <LoadOauthForm
          isVisible={formState.currentSignInForm === "loadOauth"}
          loadOrgsSuccess={() => {
            //
          }}
        />
      </Box>
    </Container>
  )
}
