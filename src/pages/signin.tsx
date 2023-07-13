import { Page } from "@/components/Page"
import { SignInPage } from "@/features"
import { GetServerSideProps } from "next"
import React from "react"

const SignIn: React.FC<{ inviteId?: string }> = ({ inviteId }) => {
  return (
    <Page title={"Sign In"}>
      <SignInPage inviteId={inviteId} />
    </Page>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const inviteId = context.query?.inviteId

  return {
    props: {
      inviteId: inviteId ? inviteId : null,
    },
  }
}

export default SignIn
