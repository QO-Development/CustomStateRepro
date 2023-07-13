import { Typography, TypographyProps, useTheme } from "@mui/material"
import React from "react"

export const RobotoTypography: React.FC<TypographyProps> = (props) => {
  const theme = useTheme()

  return <Typography color={theme.palette.text.primary} {...props} />
}
