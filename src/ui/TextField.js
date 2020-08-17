import React from "react"

import { withStyles, TextField } from "@material-ui/core"

import { colors, spacings, radii } from "../constants"

const StyledTextField = withStyles({
  root: {
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
      },
    },
  },
})(TextField)

export default (props) => (
  <StyledTextField
    variant="outlined"
    size="small"
    color="primary"
    fullWidth
    {...props}
  />
)
