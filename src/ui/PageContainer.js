import React from "react"
import { Grid } from "@material-ui/core"
import { spacings } from "../constants"

export default ({ children, ...props }) => (
  <Grid
    container
    style={{
      height: "100vh",
      maxHeight: "100vh",
      margin: 0,
      padding: `calc(${spacings.medium} / 2)`,
      overflowY: "scroll",
      textAlign: "left",
    }}
    alignItems="stretch"
    alignContent="flex-start"
    justify="flex-start"
    spacing={3}
    {...props}
  >
    {children}
  </Grid>
)
