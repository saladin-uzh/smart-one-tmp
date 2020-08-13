import React from "react"
import { spacings } from "../constants"

const { withStyles, Button } = require("@material-ui/core")

const StyledButton = withStyles({
  root: {
    textTransform: "none",
    fontWeight: "bold",
    padding: `0 ${spacings.xxLarge}`,
    "&:hover, &:active, &:focus": {
      textDecoration: "underline",
    },
  },
})(Button)

export default ({ children, ...props }) => {
  return (
    <StyledButton
      size="small"
      variant="text"
      color="primary"
      {...props}
      disableFocusRipple
      disableRipple
    >
      {children}
    </StyledButton>
  )
}
