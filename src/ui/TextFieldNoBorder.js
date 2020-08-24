import React from "react"
import { makeStyles, TextField } from "@material-ui/core"
import clsx from "clsx"
import { colors, radii, spacings } from "../constants"

const useStyles = makeStyles(({ palette }) => ({
  noBorder: {
    minWidth: 150,
    maxWidth: 200,
    marginLeft: "auto",
    backgroundColor: ({ bg }) => bg,
    borderRadius: radii.border,
    paddingTop: ({ isTiny }) => (isTiny ? 0 : spacings.xxSmall),
    paddingLeft: spacings.small,
    paddingBottom: ({ isTiny }) =>
      `${isTiny ? 0 : spacings.xxSmall} !important`,
    "&::before, &::after": {
      border: "0 !important",
    },
    "& .MuiAutocomplete-endAdornment": {
      right: spacings.xxSmall,
      top: ({ isTiny }) => (isTiny ? ".125em" : spacings.xxSmall),
    },
  },
  hasError: {
    color: palette.error.contrastText,
    backgroundColor: `${palette.error.light} !important`,

    "& .MuiAutocomplete-endAdornment button .MuiIconButton-label": {
      color: `${palette.error.contrastText} !important`,
    },
  },
}))

export default ({
  InputProps,
  error = false,
  isTiny = false,
  bg = colors.white,
  ...props
}) => {
  const classes = useStyles({ isTiny, bg })
  const className = clsx(InputProps.className, classes.noBorder, {
    [classes.hasError]: error,
  })

  return (
    <TextField
      {...props}
      size="medium"
      InputProps={{ ...InputProps, className }}
    />
  )
}
