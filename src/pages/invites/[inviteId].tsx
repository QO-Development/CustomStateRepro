/*
 * Copyright (c) 2023 Roboto Technologies, Inc.
 */
import { PageWithRedirectProtection } from "@/components"
import { InvitePage } from "@/features"
import { GetServerSideProps } from "next"
import React from "react"

const InviteId: React.FC<{ inviteId: string | null }> = ({ inviteId }) => {
  return (
    <PageWithRedirectProtection
      title={"Roboto - Invite"}
      inviteId={inviteId ? inviteId : undefined}
    >
      <InvitePage inviteId={inviteId ? inviteId : ""} />
    </PageWithRedirectProtection>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Note: the context parameter "inviteId" comes from the file name [inviteId].tsx
  const inviteId = context.params?.inviteId

  return {
    props: {
      inviteId: inviteId ? inviteId : null,
    },
  }
}

export default InviteId
