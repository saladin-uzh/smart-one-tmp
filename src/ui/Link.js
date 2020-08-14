import React from "react"
import { withStyles, Button } from "@material-ui/core"

import { spacings } from "../constants"

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
