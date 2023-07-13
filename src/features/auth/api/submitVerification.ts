import { useAuth } from "@/providers"
import { APIService } from "@/service"
import { GetOrganizationsResponse } from "@/service/apiService"
import { APIServiceError, RobotoAPICall, usersOrgsEndpoint } from "@/types"
import { useState } from "react"

export const useSubmitVerification = () => {
  //
  const [loading, setLoading] = useState<boolean>(false)
  const [errMsg, setErrMsg] = useState<string | null>(null)

  const { submitVerificationCode, signIn } = useAuth()

  const submitVerification = async (
    emailAddress: string,
    code: string,
    password: string,
  ): Promise<{
    organizations: GetOrganizationsResponse | null
    errMsg: string | null
  }> => {
    //
    setLoading(true)

    let err = await submitVerificationCode(emailAddress, code)

    err = await signIn(emailAddress, password)

    if (err) {
      setErrMsg(err)
      setLoading(false)
      return { organizations: null, errMsg: err }
    }

    const apiCall: RobotoAPICall = {
      endpoint: usersOrgsEndpoint,
      method: "GET",
    }

    const { response, error } = (await APIService.authorizedRequest(
      apiCall,
    )) as { response: GetOrganizationsResponse; error: APIServiceError }

    if (error) {
      setErrMsg(error.message)
      setLoading(false)
      return { organizations: null, errMsg: error.message }
    }

    setLoading(false)

    return { organizations: response, errMsg: null }
  }

  const clearErrMsg = () => {
    setErrMsg(null)
  }

  return { loading, errMsg, submitVerification, clearErrMsg }
}
