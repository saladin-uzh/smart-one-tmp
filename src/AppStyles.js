import { CssBaseline } from "@material-ui/core"
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import React from "react"
import { colors, spacings } from "./constants"
import avenirFont from "./fonts/AvenirLT-Book.ttf"

export const SmartOneTheme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        html: {
          WebkitFontSmoothing: "auto",
        },
        "@font-face": {
          fontFamily: "Avenir",
          src: `url(${avenirFont})`,
        },
        body: {
          margin: 0,
          padding: 0,
          fontFamily: "'Avenir', Open Sans, Sans",
          position: "absolute",
          width: "100%",
          height: "100%",
          display: "flex",
          "& #root": {
            flexGrow: 1,
            "& .App": {
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              "&-header": {
                color: colors.white,
              },
            },
          },
        },
      },
    },
  },
  props: {
    MuiButton: {
      variant: "contained",
      size: "large",
      color: "primary",
    },
  },
  palette: {
    primary: {
      main: colors.main,
    },
    text: {
      primary: colors.text,
    },
  },
  spacing: [...Object.values(spacings), null, null, null, null, null],
})

export const GlobalStylesProvider = ({ children }) => {
  return (
    <ThemeProvider theme={SmartOneTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
