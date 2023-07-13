import { APIServiceError, RobotoAPICall } from "@/types"
import { Auth } from "aws-amplify"

import { LoggerService } from "../loggerService"
import { APIServiceInterface } from "./types"

/**
 * Uses the Singleton pattern to provide an instance of the API service

 * Things to add:
 * - Retry logic
 * - Pagination, make it easy to use? Need to dig into API and see how it works now
 * - Timeouts
 * - Cancellation, provide an easy way to cancel in flight requests
 * - Rate limiting
 * - Metrics and Logging, e.g. Mixpanel
 * - Caching
 */

export const APIService: APIServiceInterface = (function () {
  //
  // eslint-disable-next-line prefer-const
  let instance

  if (instance) {
    return instance
  }

  const apiVersion = "v1"

  let apiURL = process.env.NEXT_PUBLIC_API_URL

  if (!apiURL) {
    throw new Error(
      "API URL not set. Check environment variable configuration.",
    )
  }

  apiURL = `${apiURL}/${apiVersion}`

  const authorizedRequest = async (
    apiCall: RobotoAPICall,
  ): Promise<{ response: unknown | null; error: APIServiceError | null }> => {
    let token: string

    try {
      const creds = await Auth.currentSession()
      token = creds.getIdToken().getJwtToken()
    } catch (e) {
      LoggerService.log("No auth credentials found. Log out and try again.")
      return {
        response: null,
        error: new Error("No auth credentials found. Log out and try again."),
      }
    }

    try {
      const headers = apiCall.headers || {}
      headers["Content-Type"] = "application/json"
      headers["Authorization"] = `Bearer ${token}`

      if (apiCall.orgId) {
        headers["X-Roboto-Org-Id"] = apiCall.orgId
      }

      let urlString = ""

      if (apiCall.queryParams) {
        const queryString = apiCall.queryParams.toString()

        urlString = `${
          apiURL + apiCall.endpoint(apiCall.pathParams)
        }?${queryString}`
      } else {
        urlString = apiURL + apiCall.endpoint(apiCall.pathParams)
      }

      const response = await fetch(urlString, {
        method: apiCall.method,
        headers: headers,
        body: apiCall.requestBody,
      })

      if (!response.ok) {
        return {
          response: null,
          error: new Error(`Request failed with status ${response.status}`),
        }
      }

      const responseJSON = await response.json()

      return {
        response: responseJSON,
        error: null,
      }
    } catch (e) {
      LoggerService.error("API request failed: ", e)
      return { response: null, error: new Error("API request failed") }
    }
  }

  instance = {
    authorizedRequest,
  }

  return instance
})()
