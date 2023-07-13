import { APIService, LoggerService } from "@/service"
import { Organization } from "@/service/apiService"
import { RobotoAPICall, usersEndpoint } from "@/types"
import { HubCallback } from "@aws-amplify/core"
import { Amplify, Auth, Hub } from "aws-amplify"
import React, { useEffect, useState } from "react"

import { AuthContext } from "./AuthContext"

Amplify.configure({
  aws_cognito_region: process.env.NEXT_PUBLIC_AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id:
    process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID,
  oauth: {
    redirectSignIn: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_IN,
    redirectSignOut: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_OUT,
    domain: process.env.NEXT_PUBLIC_OAUTH_COGNITO_DOMAIN,
    scope: ["email", "profile", "openid"],
    responseType: "code",
  },
})

interface AuthProviderProps {
  children: React.ReactNode
}

interface AuthProviderState {
  isAuthenticated: boolean
  isLoading: boolean
  currentUser: any
  currentOrganization: Organization | null
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthProviderState>({
    isAuthenticated: false,
    currentUser: null,
    isLoading: true,
    currentOrganization: null,
  })

  useEffect(() => {
    const checkAuth = async () => {
      //
      const userAPICall: RobotoAPICall = {
        endpoint: usersEndpoint,
        method: "GET",
      }

      try {
        // This will throw an error if the user is not authenticated
        const user = await Auth.currentAuthenticatedUser()
        LoggerService.log("User is authenticated with Cognito: ", user)

        const { response, error } = await APIService.authorizedRequest(
          userAPICall,
        )

        if (error) {
          LoggerService.error(
            "Error getting current user, signing out: ",
            error,
          )

          Auth.signOut()
          return
        }

        let storedOrg: Organization | null = null

        if (typeof window !== "undefined") {
          const serializedOrg = localStorage.getItem("currentOrg")
          if (serializedOrg && serializedOrg !== "undefined") {
            storedOrg = JSON.parse(serializedOrg)
          }
        }

        setAuthState({
          isAuthenticated: true,

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          currentUser: response?.data,
          isLoading: false,
          currentOrganization: storedOrg,
        })
      } catch (e) {
        LoggerService.log("User is not authenticated: ", e)

        Auth.signOut()
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    const listener: HubCallback = async (authListener) => {
      //
      switch (authListener.payload.event) {
        case "customOAuthState": {
          LoggerService.log("custom state returned from CognitoHosted UI")
          LoggerService.log(authListener.payload.data)
          break
        }
        case "customState_failure":
          LoggerService.error("custom state failure")
          break
      }
    }

    const removeListener = Hub.listen("auth", listener)

    return () => {
      removeListener()
    }
  }, [])

  const signUp = async (
    emailAddress: string,
    password: string,
  ): Promise<string | null> => {
    try {
      const { user } = await Auth.signUp({
        username: emailAddress,
        password: password,
        attributes: {
          email: emailAddress,
        },
        autoSignIn: {
          // optional - enables auto sign in after user is confirmed
          enabled: true,
        },
      })

      LoggerService.log("Successful sign up: ", user)

      return null

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      LoggerService.log("error signing up:", error)

      if (error.message) {
        return error.message
      }

      return "There was an error signing up. Please try again."
    }
  }

  const signIn = async (
    emailAddress: string,
    password: string,
  ): Promise<string | null> => {
    try {
      await Auth.signIn(emailAddress, password)

      return null

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      LoggerService.log("error signing in:", error)

      if (error.message) {
        return error.message
      }

      return "There was an error signing in. Please try again."
    }
  }

  const signOut = async (): Promise<string | null> => {
    try {
      await Auth.signOut()

      return null

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      LoggerService.log("error signing out:", error)

      if (error.message) {
        return error.message
      }

      return "There was an error signing out. Please try again."
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,
        currentUser: authState.currentUser,
        currentOrganization: authState.currentOrganization,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
