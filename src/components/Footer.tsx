import { useTheme } from "@mui/material"
import { Box, Typography } from "@mui/material"
import React from "react"

export const Footer: React.FC = () => {
  const theme = useTheme()

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: theme.spacing(2.5),
          marginBottom: theme.spacing(2.5)
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "#909399",
          }}
        >
          Copyright &copy; 2023 Roboto Technologies, Inc. All rights reserved.
        </Typography>
      </Box>
    </>
  )
}
