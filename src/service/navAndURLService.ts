import { PageRoute } from "@/types"
import { useRouter } from "next/router"

export const useNavigationService = () => {
  const router = useRouter()

  const goToSignIn = (inviteId?: string) => {
    if (inviteId) {
      router.push(`${PageRoute.SignIn}?inviteId=${inviteId}`)
      return
    }

    router.push(PageRoute.SignIn)
  }

  const goToSignUp = () => {
    router.push(PageRoute.SignUp)
  }

  const goToHome = () => {
    router.push(PageRoute.Home)
  }

  const goToInvite = (inviteId?: string) => {
    if (inviteId) {
      router.push(`${PageRoute.Invite}/${inviteId}`)
      return
    }

    router.push(PageRoute.Invite)
  }

  const goToIndividualDataset = (datasetId: string) => {
    router.push(`${PageRoute.Datasets}/${datasetId}`)
  }

  //   interface QueryObject {
  //     [key: string]: string
  //   }

  // Example for a more complex route
  //   const goToCategory = (categoryId: string, queryParams: QueryObject) => {
  //     const query = new URLSearchParams(queryParams).toString()
  //     router.push(`PageRoute.Category/${categoryId}?${query}`)
  //   }

  return {
    goToSignIn,
    goToSignUp,
    goToHome,
    goToInvite,
    goToIndividualDataset,
  }
}

export const useURLService = () => {
  // these functions can be used to generate urls for <Link> components
  function generateSignUpURL(inviteId?: string) {
    if (inviteId) {
      return `${PageRoute.SignUp}?inviteId=${inviteId}`
    }

    return PageRoute.SignUp
  }

  function generateSignInURL(inviteId?: string) {
    if (inviteId) {
      return `${PageRoute.SignIn}?inviteId=${inviteId}`
    }

    return PageRoute.SignIn
  }

  return {
    generateSignUpURL,
    generateSignInURL,
  }
}
