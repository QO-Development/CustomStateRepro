import { Organization } from "@/service/apiService"
import React, { useContext } from "react"

import { LoggerService } from "../../service"

export type Auth = {
  isAuthenticated: boolean
  isLoading: boolean
  currentUser: any
  currentOrganization: Organization | null
  signUp: (emailAddress: string, password: string) => Promise<string | null>

  signIn: (emailAddress: string, password: string) => Promise<string | null>
  signOut: () => Promise<string | null>
}

export const useAuth = (): Auth => {
  return useContext(AuthContext)
}

export const AuthContext = React.createContext<Auth>({
  isAuthenticated: false,
  isLoading: false,
  currentUser: null,
  currentOrganization: null,
  signUp: async () => {
    LoggerService.log("TODO: WRAP IN VALID ANALYTICS PROVIDER")

    return null
  },

  signIn: async () => {
    LoggerService.log("TODO: WRAP IN VALID ANALYTICS PROVIDER")

    return null
  },
  signOut: async () => {
    LoggerService.log("TODO: WRAP IN VALID ANALYTICS PROVIDER")

    return null
  },
})
