import { useTheme } from "@mui/material"
import Head from "next/head"
import React from "react"

import { MainContent } from "./MainContent"

export interface PageProps {
  title: string
  children: React.ReactNode
}

export const Page: React.FC<PageProps> = ({ title, children }) => {
  const theme = useTheme()

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <MainContent theme={theme}>{children}</MainContent>
    </>
  )
}
