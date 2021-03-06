import React from "react"
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import { CssBaseline } from "@material-ui/core"

import { colors, spacings, radii } from "./constants"

import AvenirTtf from "./fonts/AvenirLT-Book.ttf"

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
          height: "100vh",
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
        fontSize: 16,
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
          backgroundColor: `${colors.main} !important`,
          "& .MuiChip-deleteIcon": {
            color: colors.white,
          },
        },
      },
      deleteIcon: {
        color: colors.text,
      },
    },
    MuiCard: {
      root: {
        textAlign: "left",
        margin: 0,
        padding: spacings.large,

        "& .MuiCardContent-root": {
          padding: spacings.small,
          height: "auto",
          width: "auto",
        },

        "& .MuiCardActions-root": {
          justifyContent: "flex-end",
        },
      },
    },
    MuiCardHeader: {
      root: {
        color: colors.main,
      },
      // content: {
      //   flexGrow: 0,
      // },
      action: {
        marginLeft: "auto",
      },
    },
    MuiTableCell: {
      root: {
        padding: `${spacings.small}`,
      },
      paddingCheckbox: {
        padding: `7px ${spacings.xxSmall} 8px ${spacings.small} !important`,
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
    MuiPopover: {
      paper: {
        "& .MuiPickersDatePickerRoot-toolbar": {
          "& .MuiPickersToolbarButton-toolbarBtn": {
            "& .MuiPickersToolbarText-toolbarTxt": {
              color: colors.white,
            },
          },
        },
        "& .MuiPickersBasePicker-pickerView": {
          "& .MuiPickersCalendar-week": {
            "& .MuiPickersDay-daySelected": {
              color: colors.white,
            },
          },
        },
      },
    },
    MuiDialog: {
      paper: {
        minWidth: `calc(${spacings.xLarge} * 10)`,
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
      light: colors.mainFaded,
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
