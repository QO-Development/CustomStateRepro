import { useAnalytics } from "@/providers"
import { AnalyticsEvent, MixpanelEventProps } from "@/types"
import { Button, ButtonProps, CircularProgress } from "@mui/material"
import React from "react"

interface RobotoButtonProps extends ButtonProps {
  eventName: AnalyticsEvent
  eventProperties?: MixpanelEventProps[AnalyticsEvent]
  loading?: boolean
}

export const RobotoButton: React.FC<RobotoButtonProps> = ({
  onClick,
  eventName,
  eventProperties,
  loading,
  ...props
}) => {
  const { trackEvent } = useAnalytics()

  return (
    <Button
      disableElevation
      onClick={(event) => {
        trackEvent(eventName, eventProperties)

        if (onClick) onClick(event)
      }}
      style={{
        textTransform: "none",
      }}
      {...props}
    >
      {loading ? <CircularProgress /> : props.children}
    </Button>
  )
}
