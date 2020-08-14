import React from "react"
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import { CssBaseline, fade } from "@material-ui/core"

import { colors, spacings, radii } from "./constants"

import AvenirTtf from "./fonts/AvenirLT-Book.ttf"

const tableBodyBorder = `1px solid ${colors.main}`

const SmartOneTheme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        html: {
          width: "100%",
          height: "100%",
        },
        "@font-face": {
          fontFamily: "Avenir",
          src: `url(${AvenirTtf})`,
        },
        body: {
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          "& #root": {
            flexGrow: 1,
            textAlign: "center",
            width: "100%",
            height: "100%",
          },
        },
      },
    },
    MuiButton: {
      root: {
        paddingTop: 0,
        paddingBottom: 0,
        textTransform: "none",
        fontSize: "1em",
        fontWeight: "bold",
      },
      label: {
        height: "100%",
        fontWeight: "bold",
      },
      containedPrimary: {
        color: colors.white,
      },
      containedSecondary: {
        backgroundColor: colors.white,
        color: colors.text,
        "&:hover": {
          backgroundColor: colors.main,
          color: colors.white,
        },
      },
    },
    MuiFab: {
      root: {
        width: "auto",
        height: "auto",
        minHeight: "auto",
        color: colors.text,
        backgroundColor: colors.white,
        padding: 3,
        "&:hover": {
          color: colors.white,
          backgroundColor: colors.main,
        },
      },
    },
    MuiChip: {
      root: {
        transition: "none",
        color: colors.text,
        backgroundColor: colors.white,
        height: "auto",
        "&:hover": {
          color: colors.white,
          backgroundColor: colors.main,
          "& .MuiChip-deleteIcon": {
            color: colors.white,
          },
        },
      },
      deleteIcon: {
        color: colors.text,
      },
    },
    MuiCardHeader: {
      root: {
        color: colors.main,
      },
    },
    MuiTable: {
      root: {
        borderCollapse: "separate",
      },
    },
    MuiTableBody: {
      root: {
        "& .MuiTableRow-root": {
          "&:first-child .MuiTableCell-root": {
            borderTop: tableBodyBorder,
          },
          "&:last-child .MuiTableCell-root": {
            borderBottom: tableBodyBorder,
          },
        },
        "& .MuiTableCell-root": {
          borderBottom: 0,
          "&:first-child": {
            borderLeft: tableBodyBorder,
            borderLeftStyle: "double",
            borderLeftWidth: 1,
          },
          "&:last-child": {
            borderRight: tableBodyBorder,
          },
        },
        "& .MuiTableRow-head": {
          "& .MuiTableCell-root": {
            border: 0,
          },
        },
      },
    },
    MuiTableRow: {
      root: {
        "&:not(.MuiTableRow-head)": {
          cursor: "pointer",
          "&:hover": {
            backgroundColor: colors.mainFaded,
          },
          "&$selected": {
            backgroundColor: colors.mainFaded,
          },
        },
      },
    },
    MuiCheckbox: {
      root: {
        "& .MuiIconButton-label": {
          color: colors.main,
        },
      },
    },
    MuiListItem: {
      root: {
        "&:last-child": {
          marginBottom: `0 !important`,
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
    background: {
      default: colors.whiteBg,
      paper: colors.white,
    },
    primary: {
      main: colors.main,
    },
    secondary: {
      main: colors.main,
    },
    text: {
      primary: colors.text,
    },
    divider: colors.main,
  },
  spacing: [...Object.values(spacings), null, null, null, null, null],
  shape: {
    borderRadius: radii.border,
  },
  shadows: new Array(25).fill(`1px 1px 4px ${colors.grey}`),
  typography: {
    fontSize: 16,
    fontFamily: "'Avenir', Open Sans, Sans, sans-serif",
  },
})

export default ({ children }) => {
  return (
    <ThemeProvider theme={SmartOneTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
