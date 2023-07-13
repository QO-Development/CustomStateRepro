import { Box, SxProps, Theme, useTheme } from "@mui/material"
import logoDarkText from "@public/logoDarkText.svg"
import logoWhiteText from "@public/logoWhiteText.svg"
import Image from "next/image"
import React from "react"

interface RobotoLogoProps {
  fill?: boolean
  sx?: SxProps<Theme> | undefined
}

export const RobotoLogo: React.FC<RobotoLogoProps> = ({ fill, sx }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        padding: theme.spacing(2.5),
        marginBottom: theme.spacing(4),
        marginTop: theme.spacing(3),
        width: "100%",
        position: "relative",
        ...sx,
      }}
    >
      <Image
        src={theme.palette.mode === "dark" ? logoWhiteText : logoDarkText}
        alt="logo"
        fill={fill ?? true}
        placeholder="blur"
        blurDataURL={
          theme.palette.mode === "dark"
            ? "logoWhiteText.svg"
            : "logoDarkText.svg"
        }
      />
    </Box>
  )
}
