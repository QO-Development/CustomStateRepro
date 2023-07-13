import { RobotoAPICall } from "@/types"
import { APIServiceError, CallState } from "@/types"
import { useCallback, useEffect, useState } from "react"

import { APIService } from "../apiService"

interface IUseLazyAPIQuery<Data> {
  loading: boolean
  error: APIServiceError | null
  data: Data | null
  initiateRequest: (
    apiCall: RobotoAPICall,
  ) => Promise<{ error: APIServiceError | null; data: Data | null }>
}

export const useLazyAPICall = <
  ResponseData,
>(): IUseLazyAPIQuery<ResponseData> => {
  //
  const [callState, setCallState] = useState<CallState<ResponseData>>({
    loading: false,
    error: null,
    data: null,
  })

  const initiateRequest = useCallback(async (apiCall: RobotoAPICall) => {
    return await initiateRequestFunc<ResponseData>(apiCall, setCallState)
  }, [])

  return {
    loading: callState.loading,
    error: callState.error,
    data: callState.data,
    initiateRequest,
  }
}

interface IUseAPIQuery<ResponseData> {
  loading: boolean
  error: APIServiceError | null
  data: ResponseData | null
  refetch: () => void
}

export const useAPICall = <ResponseData>(
  apiCall: RobotoAPICall,
): IUseAPIQuery<ResponseData> => {
  //
  const [callState, setCallState] = useState<CallState<ResponseData>>({
    loading: false,
    error: null,
    data: null,
  })

  useEffect(() => {
    initiateRequestFunc<ResponseData>(apiCall, setCallState)
    // This API call should only be called once. If the apiCall changes, this hook probably shouldn't be used. Use useLazyAPICall instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refetch = () => {
    initiateRequestFunc<ResponseData>(apiCall, setCallState)
  }

  return {
    loading: callState.loading,
    error: callState.error,
    data: callState.data,
    refetch,
  }
}

const initiateRequestFunc = async <ResponseData>(
  apiCall: RobotoAPICall,
  setCallState: React.Dispatch<React.SetStateAction<CallState<ResponseData>>>,
): Promise<{ error: APIServiceError | null; data: ResponseData | null }> => {
  setCallState({ loading: true, error: null, data: null })

  const { response, error } = await APIService.authorizedRequest(apiCall)

  if (error) {
    setCallState({ loading: false, error: error, data: null })

    return {
      error: error,
      data: null,
    }
  }

  setCallState({ loading: false, error: null, data: response as ResponseData })

  return { error: null, data: response as ResponseData }
}
