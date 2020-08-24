import React from "react"

import { withStyles } from "@material-ui/core"

import { spacings } from "../constants"

export default withStyles({
  heading: {
    margin: "0 auto 0 0",
    fontSize: 24,
    display: "flex",
    alignItems: "center",
    textOverflow: "ellipsis",
  },
  icon: {
    marginRight: spacings.xSmall,
    bottom: `calc(${spacings.xxSmall} / 2)`,
    position: "relative",
  },
})(({ classes, text, icon: Icon, ...props }) => (
  <h3 className={classes.heading} {...props}>
    <Icon className={classes.icon} />
    {text}
  </h3>
))
