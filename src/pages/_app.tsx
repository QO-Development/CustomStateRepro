import Providers from "@/providers"
import "@/styles/globals.css"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import React from "react"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Head>
        <meta name="description" content="Roboto AI Cloud" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </Providers>
  )
}
