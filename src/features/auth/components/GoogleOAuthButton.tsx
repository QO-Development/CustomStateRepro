import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth"
import { Google as GoogleIcon } from "@mui/icons-material"
import { Button } from "@mui/material"
import { Auth } from "aws-amplify"
import { useRouter } from "next/router"
import React from "react"

interface GoogleButtonProps {
  signUp: boolean
  buttonWidth: number
  marginBottom: string
  onClick: () => void
}

const GoogleButtonComponent: React.FC<GoogleButtonProps> = ({
  signUp,
  buttonWidth,
  marginBottom,
  onClick,
}) => {
  const router = useRouter()

  const inviteId = router.query.inviteId as string

  return (
    <Button
      sx={{ width: buttonWidth, marginBottom }}
      variant={"contained"}
      startIcon={<GoogleIcon />}
      onClick={() => {
        //
        onClick()

        if (inviteId) {
          Auth.federatedSignIn({
            provider: CognitoHostedUIIdentityProvider.Google,
            customState: JSON.stringify({ inviteId: inviteId }),
          })
        } else {
          Auth.federatedSignIn({
            provider: CognitoHostedUIIdentityProvider.Google,
            customState: "I AM AWESOME CUSTOM STATE",
          })
        }

        //
      }}
    >
      {signUp ? "Sign up" : "Sign in"} with Google
    </Button>
  )
}

export default GoogleButtonComponent
