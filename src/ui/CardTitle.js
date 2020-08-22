import React from "react"

import { withStyles } from "@material-ui/core"

import { spacings } from "../constants"

export default withStyles({
  heading: {
    margin: 0,
    fontSize: 24,
    display: "flex",
    alignItems: "center",
  },
  icon: {
    marginRight: spacings.xSmall,
  },
})(({ classes, text, icon: Icon, ...props }) => (
  <h3 className={classes.heading} {...props}>
    <Icon className={classes.icon} />
    {text}
  </h3>
))
