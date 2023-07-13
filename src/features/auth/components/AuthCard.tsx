import { Paper, useTheme } from "@mui/material"
import React from "react"

interface AuthCardProps {
  children: React.ReactNode
  settingsPage?: boolean
}

export const AuthCard: React.FC<AuthCardProps> = (props) => {
  const theme = useTheme()

  return (
    <Paper
      sx={{
        width: "100%",
        maxWidth: {
          xs: "100vw",
          sm: "580px",
        },
        minWidth: "300px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: props.settingsPage ? "normal" : "center",
        backgroundColor: props.settingsPage
          ? "transparent"
          : theme.palette.foreground.main,
        border: props.settingsPage ? "none" : theme.border.thin,
        borderRadius: theme.border.radius,
        padding: props.settingsPage ? theme.spacing(0, 0) : theme.spacing(2),
      }}
      elevation={props.settingsPage ? 0 : 1}
    >
      {props.children}
    </Paper>
  )
}
