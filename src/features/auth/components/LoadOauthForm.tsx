import { RobotoTypography } from "@/components"
import { RobotoLogo } from "@/components"
import { LoggerService } from "@/service"
import { GetOrganizationsResponse } from "@/service/apiService"
import { APIService } from "@/service/apiService"
import { PageRoute, RobotoAPICall, usersOrgsEndpoint } from "@/types"
import { CircularProgress } from "@mui/material"
import { useTheme } from "@mui/material"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

import { AuthCard } from "./AuthCard"

interface SignInFormProps {
  isVisible: boolean
  loadOrgsSuccess: (
    orgs: GetOrganizationsResponse | null,
    inviteId: string | null,
  ) => void
}

export const LoadOauthForm: React.FC<SignInFormProps> = ({
  isVisible,
  loadOrgsSuccess,
}) => {
  const theme = useTheme()

  const router = useRouter()

  const [errMsg, setErrMsg] = useState<string | null>(null)

  useEffect(() => {
    const getOrgs = async () => {
      const apiCall: RobotoAPICall = {
        endpoint: usersOrgsEndpoint,
        method: "GET",
      }

      const { response, error } = await APIService.authorizedRequest(apiCall)

      if (error) {
        setErrMsg(error.message)
        return
      }

      let inviteId = null

      if (router.query.state) {
        try {
          inviteId = router.query.state as string
          inviteId = inviteId.split("-")[1] as string

          if (!inviteId) {
            // no custom state has been passed, no need to parse
            loadOrgsSuccess(response as GetOrganizationsResponse, null)
            return
          }

          inviteId = Buffer.from(inviteId, "hex").toString("utf8") as string
          inviteId = JSON.parse(inviteId).inviteId as string
        } catch (e) {
          LoggerService.log(e)
          setErrMsg("Invalid invite link")
          return
        }
      }

      loadOrgsSuccess(response as GetOrganizationsResponse, inviteId)
    }

    if (isVisible) {
      getOrgs()
    }
  }, [isVisible, loadOrgsSuccess, router.query.state])

  if (!isVisible) return null

  return (
    <AuthCard>
      <RobotoLogo />

      <RobotoTypography sx={{ marginBottom: theme.spacing(4) }} variant="h5">
        Sign in
      </RobotoTypography>

      {!errMsg && <CircularProgress />}

      {errMsg && (
        <RobotoTypography
          variant={"caption"}
          textAlign={"center"}
          sx={{ color: theme.palette.error.main }}
        >
          Error: {errMsg}. Please try <a href={PageRoute.SignIn}>signing in</a>{" "}
          again
        </RobotoTypography>
      )}
    </AuthCard>
  )
}
