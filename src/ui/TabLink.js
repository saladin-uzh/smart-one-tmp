import React from "react"
import { withStyles } from "@material-ui/core"
import { NavLink } from "react-router-dom"
import { colors, spacings, radii } from "../constants"

export default withStyles(({ shadows }) => ({
  TabLink: {
    textDecoration: "none",
    padding: `${spacings.xSmall} ${spacings.small}`,
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    "&.currentTab": {
      backgroundColor: colors.main,
      color: colors.white,
      borderRadius: radii.border,
      boxShadow: shadows[0],
    },
  },
}))(({ classes, children, ...props }) => (
  <NavLink className={classes.TabLink} activeClassName="currentTab" {...props}>
    {children}
  </NavLink>
))
