import React from "react"
import { makeStyles, TextField } from "@material-ui/core"
import clsx from "clsx"
import { colors, radii, spacings } from "../constants"

const useStyles = makeStyles({
  noBorder: {
    minWidth: 100,
    background: ({ bg }) => bg,
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
})

export default ({
  InputProps,
  isTiny = false,
  bg = colors.white,
  ...props
}) => {
  const classes = useStyles({ isTiny, bg })
  const className = clsx(InputProps.className, classes.noBorder)

  return (
    <TextField
      {...props}
      size="medium"
      InputProps={{ ...InputProps, className }}
    />
  )
}
