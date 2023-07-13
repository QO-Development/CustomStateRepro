import { useTheme } from "@mui/material"
import { styled } from "@mui/system"
import React from "react"

export const MainContent = styled("main")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: theme.palette.background.default,
  padding: 0,
  margin: 0,
}))

interface MainNavigationContentProps {
  sideBarWidth: string
  topBarHeight: string
}

const MainNavigationContent = styled("main")<MainNavigationContentProps>(
  ({ theme, sideBarWidth, topBarHeight }) => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: theme.palette.background.default,
    padding: 0,
    paddingTop: topBarHeight,
    paddingLeft: sideBarWidth,
    margin: 0,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
    },
  }),
)

interface MainContentWithNavigationProps extends MainNavigationContentProps {
  children: React.ReactNode
}

export const MainContentWithNavigation: React.FC<
  MainContentWithNavigationProps
> = ({ sideBarWidth, topBarHeight, children }) => {
  const theme = useTheme()

  return (
    <MainNavigationContent
      sideBarWidth={sideBarWidth}
      topBarHeight={topBarHeight}
      theme={theme}
    >
      {children}
    </MainNavigationContent>
  )
}
