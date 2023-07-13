/* eslint-disable no-console */
/**
 * Use the Singleton pattern and an environment variable to log console output only when in dev mode
 */

export const LoggerService = (function () {
  // eslint-disable-next-line prefer-const
  let instance
  let env: string

  if (instance) {
    return instance
  }

  // eslint-disable-next-line prefer-const
  env = process.env.NEXT_PUBLIC_REACT_APP_ENV ?? "dev"

  instance = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log(message?: any, ...optionalParams: any[]) {
      if (env === "dev") {
        console.log(message, ...optionalParams)
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error(message: any, errorObject?: any) {
      if (env === "dev") {
        console.error(message, errorObject)
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn(message?: any, ...optionalParams: any[]) {
      if (env === "dev") {
        console.warn(message, ...optionalParams)
      }
    },
  }

  return instance
})()
