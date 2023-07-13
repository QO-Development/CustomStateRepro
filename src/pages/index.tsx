/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  NavigationPageWithRedirectProtection,
  PageHeader,
  RobotoDivider,
} from "@/components"
import { useAuth } from "@/providers"
import { LoggerService } from "@/service"
import { Organization } from "@/service/apiService"
import { User } from "@/types"
import { Typography } from "@mui/material"
import React, { useEffect, useState } from "react"

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null)
  const [email, setEmail] = useState<string | null>("")
  const [name, setName] = useState<string | null>("")

  const { getCurrentUser, getCurrentOrganization, getUserIdToken } = useAuth()

  useEffect(() => {
    const getUser = async () => {
      LoggerService.log("Getting user")
      const user = await getCurrentUser()
      setCurrentUser(user)

      const userIdToken = await getUserIdToken()
      setEmail(userIdToken?.email ?? null)
      setName(userIdToken?.name ?? null)
    }

    getUser()
  }, [getCurrentUser, getUserIdToken])

  useEffect(() => {
    const currentOrg = getCurrentOrganization()

    setCurrentOrganization(currentOrg)
  }, [getCurrentOrganization])

  return (
    <NavigationPageWithRedirectProtection title={"Roboto - Dashboard"}>
      <PageHeader>Welcome, {name ? name : email?.split("@")[0]}</PageHeader>
      <RobotoDivider />
      {/** @ts-ignore */}
      <Typography>The current user is: {currentUser?.user_id}</Typography>
      <Typography>
        {/** @ts-ignore */}
        The current email (parsed from JWT token) is: {email}
      </Typography>
      <Typography>
        {/** @ts-ignore */}
        The current org is: {currentOrganization?.name}
      </Typography>
    </NavigationPageWithRedirectProtection>
  )
}
