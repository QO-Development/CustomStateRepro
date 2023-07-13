import React, { FC } from "react"

import { MUIThemeProvider } from "./MUIThemeProvider"
import { AuthProvider } from "./auth"

interface ProvidersProps {
  children: React.ReactNode
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <MUIThemeProvider>{children}</MUIThemeProvider>
    </AuthProvider>
  )
}

export default Providers
