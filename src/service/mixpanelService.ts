import { AnalyticsEvent, MixpanelEventProps } from "@/types"
import mixpanel from "mixpanel-browser"

const DEV_ENV_NAME = "dev"

/**
 * Use the Singleton pattern to provide an instance of the Mixpanel service
 */

export const MixpanelService = (function () {
  // eslint-disable-next-line prefer-const
  let instance

  if (instance) {
    return instance
  }

  const env: string | undefined = process.env.NEXT_PUBLIC_REACT_APP_ENV

  const projectToken: string | undefined =
    process.env.NEXT_PUBLIC_REACT_APP_MIXPANEL_TOKEN

  if (!projectToken || !env) {
    throw new Error(
      `Mixpanel Project token or environment not set. Check environment variable configuration. Project Token: ${projectToken} Environment: ${env}`,
    )
  }

  mixpanel.init(projectToken, {
    debug: env === DEV_ENV_NAME,
  })

  instance = {
    track<T extends AnalyticsEvent>(
      eventName: T,
      eventProps: MixpanelEventProps[T],
    ) {
      mixpanel.track(eventName, eventProps)
    },
  }

  return instance
})()
