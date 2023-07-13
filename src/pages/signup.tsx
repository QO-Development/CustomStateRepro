import { Page } from "@/components/Page"
import { SignUpPage } from "@/features"
import { GetServerSideProps } from "next"
import React from "react"

export const SignUp: React.FC<{ inviteId?: string }> = ({ inviteId }) => {
  return (
    <Page title={"Sign Up"}>
      <SignUpPage inviteId={inviteId} />
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

export default SignUp
