import React from "react"
import clsx from "clsx"

import { withStyles, TextField } from "@material-ui/core"

import { colors, spacings, radii } from "../constants"

export default withStyles({
  singleLine: {
    maxWidth: 300,
    "& .MuiOutlinedInput-root": {
      borderRadius: radii.border,
      "& fieldset": {
        borderColor: colors.main,
      },
      "&:hover fieldset": {
        borderColor: colors.main,
      },
      "&.Mui-focused fieldset": {
        borderColor: colors.main,
      },
    },
    "& .MuiInputLabel-outlined": {
      transform: `translate(${spacings.xxSmall}, -${spacings.medium}) scale(.9)`,
      fontWeight: "bold",
      "&.MuiInputLabel-shrink": {
        transform: `translate(${spacings.small}, -${spacings.xxSmall}) scale(.725)`,
        color: colors.main,
      },
    },
  },
  multiLine: {
    maxWidth: "100%",
  },
})(({ classes, value, onChange, ...props }) => (
  <TextField
    variant="outlined"
    size="small"
    color="primary"
    fullWidth
    className={clsx(classes.singleLine, {
      [classes.multiLine]: props.multiline,
    })}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    {...props}
  />
))
