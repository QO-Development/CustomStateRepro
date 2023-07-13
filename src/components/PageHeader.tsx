import { Typography, TypographyProps } from "@mui/material"
import React from "react"

export const PageHeader: React.FC<TypographyProps> = (props) => {
  return (
    <Typography
      sx={{
        fontSize: "1.125rem",
        fontWeight: "500",
      }}
      {...props}
    />
  )
}
