import CssBaseline from "@mui/material/CssBaseline"
import { createTheme, responsiveFontSizes } from "@mui/material/styles"
import { ThemeProvider } from "@mui/material/styles"
import React, { FC, useEffect, useState } from "react"

type ZLayer = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

declare module "@mui/material/styles" {
  // augment the existing Palette interface in MUI
  export interface PaletteOptions {
    foreground: {
      main: string
    }
    navMenu: {
      main: string
    }
    buttonHeader: {
      main: string
      hover: string
    }
  }

  export interface Palette {
    foreground: {
      main: string
    }
    navMenu: {
      main: string
    }
    buttonHeader: {
      main: string
      hover: string
    }
  }

  export interface Theme {
    border: {
      thin: string
      thick: string
      radius: string
      color: string
    }
    navTopBarHeight: string
    navSideBarWidth: string
    zLayer: (layer: ZLayer) => number
  }

  export interface ThemeOptions {
    border: Partial<Theme["border"]>
    navTopBarHeight: Theme["navTopBarHeight"]
    navSideBarWidth: Theme["navSideBarWidth"]
    zLayer: Theme["zLayer"]
  }
}

interface MUIThemeProviderProps {
  children: React.ReactNode
}

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {
    /* do nothing */
  },
})

export const MUIThemeProvider: FC<MUIThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setIsDarkMode(!isDarkMode)
      },
    }),
    [isDarkMode],
  )

  useEffect(() => {
    const matchDark = window.matchMedia("(prefers-color-scheme: dark)")
    setIsDarkMode(matchDark.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches)
    }

    matchDark.addEventListener("change", handleChange)

    return () => {
      matchDark.removeEventListener("change", handleChange)
    }
  }, [])

  return (
    <>
      <CssBaseline />
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  )
}

const createRobotoTheme = (mode: "light" | "dark") => {
  const typography = {
    fontFamily: [
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  }

  const borderColor = mode === "light" ? "#DFE3EB" : "rgb(81, 78, 83)"

  const theme = createTheme({
    typography,
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: "#355EDB",
          },
        },
      },
    },
    palette: {
      mode: mode,
      text: {
        primary: mode === "light" ? "#222222" : "#FFFFFF",
        secondary:
          mode === "light" ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.7)",
      },
      primary: {
        main: "#355EDB", // blue
        light: "#355EDB20",
        dark: "#355EDB80",
      },
      secondary: {
        main: "#DF6888", // magenta
      },
      background: {
        default: mode === "light" ? "#F7F8FA" : "#121212",
      },
      foreground: {
        main: mode === "light" ? "#FFFFFF" : "rgb(39, 39, 43)",
      },
      navMenu: {
        main: mode === "light" ? "#fff" : "rgb(39, 39, 43)",
      },
      buttonHeader: {
        main: mode === "light" ? "#DF6888CC" : "#DF6888CC",
        hover: mode === "light" ? "#DF6888" : "#DF6888",
      },
    },
    border: {
      thin: `1px solid ${borderColor}`,
      thick: `2px solid ${borderColor}`,
      radius: "4px",
      color: `${borderColor}`,
    },
    zLayer: (layer: ZLayer) => {
      switch (layer) {
        case 1:
          return 1000
        case 2:
          return 2000
        case 3:
          return 3000
        case 4:
          return 4000
        case 5:
          return 5000
        case 6:
          return 6000
        case 7:
          return 7000
        case 8:
          return 8000
        case 9:
          return 9000
        case 10:
          return 9999
      }
    },
    navTopBarHeight: "55px",
    navSideBarWidth: "55px",
  })

  return theme
}

export const lightTheme = responsiveFontSizes(createRobotoTheme("light"))

const darkTheme = responsiveFontSizes(createRobotoTheme("dark"))
