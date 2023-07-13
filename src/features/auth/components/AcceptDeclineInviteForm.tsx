/*
 * Copyright (c) 2023 Roboto Technologies, Inc.
 */
import { RobotoButton, RobotoLogo, RobotoTypography } from "@/components"
import { useAPICall, useLazyAPICall } from "@/service/apiHooks"
import { GetInviteResponse, Invite } from "@/service/apiService"
import {
  AnalyticsEvent,
  acceptInviteEndpoint,
  declineInviteEndpoint,
  inviteEndpoint,
} from "@/types"
import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  Paper,
  useTheme,
} from "@mui/material"
import React from "react"

interface AcceptDeclineInviteFormProps {
  inviteId: string
  onAccepted: (invite: Invite) => void
  onDeclined: (invite: Invite) => void
}

export const AcceptDeclineInviteForm: React.FC<
  AcceptDeclineInviteFormProps
> = ({ inviteId, onAccepted, onDeclined }) => {
  //

  const theme = useTheme()

  const { data, loading, error } = useAPICall<GetInviteResponse>({
    endpoint: inviteEndpoint,
    method: "GET",
    pathParams: { inviteId },
  })

  const { initiateRequest: initiateAcceptDeclineRequest } = useLazyAPICall()

  const onAcceptedWrapper = () => {
    initiateAcceptDeclineRequest({
      endpoint: acceptInviteEndpoint,
      method: "POST",
      pathParams: { inviteId },
    }).then(() => {
      onAccepted(data?.data as Invite)
    })
  }

  const onDeclinedWrapper = () => {
    initiateAcceptDeclineRequest({
      endpoint: declineInviteEndpoint,
      method: "POST",
      pathParams: { inviteId },
    }).then(() => {
      onDeclined(data?.data as Invite)
    })
  }

  if (error) {
    return (
      <Container
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper sx={{ padding: theme.spacing(2), marginTop: theme.spacing(2) }}>
          <RobotoTypography variant={"h5"}>Error:</RobotoTypography>
          <RobotoTypography
            variant={"h6"}
            sx={{ color: theme.palette.error.main }}
          >
            {error.message}
          </RobotoTypography>
        </Paper>
      </Container>
    )
  }

  return (
    <Container
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper sx={{ padding: theme.spacing(3), marginTop: theme.spacing(2) }}>
        <RobotoLogo />
        <RobotoTypography
          variant={"h6"}
          sx={{
            marginBottom: theme.spacing(2),
            display: "flex",
            justifyContent: "center",
          }}
        >
          The team at {data?.data.org.name} wants to work together
        </RobotoTypography>
        <RobotoTypography
          sx={{
            marginBottom: theme.spacing(2),
            display: "flex",
            justifyContent: "center",
          }}
        >
          You were invited by
        </RobotoTypography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: theme.spacing(2),
          }}
        >
          <Avatar
            src={data?.data?.invited_by?.picture_url}
            sx={{ width: 30, height: 30, marginRight: theme.spacing(1.5) }}
            imgProps={{ referrerPolicy: "no-referrer" }}
          />

          <RobotoTypography>{data?.data.invited_by.user_id}</RobotoTypography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            mt: theme.spacing(4),
            mb: theme.spacing(1),
          }}
        >
          {loading && <CircularProgress />}

          {!loading && (
            <>
              <RobotoButton
                eventName={AnalyticsEvent.AcceptOrgInviteClicked}
                onClick={onAcceptedWrapper}
                variant={"contained"}
                sx={{ width: "150px", marginRight: theme.spacing(2) }}
              >
                Accept
              </RobotoButton>
              <RobotoButton
                eventName={AnalyticsEvent.DeclineOrgInviteClicked}
                onClick={onDeclinedWrapper}
                variant={"outlined"}
                sx={{ width: "150px" }}
              >
                Decline
              </RobotoButton>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  )
}
