import React from "react"
import { makeStyles } from "@material-ui/core"
import { NavLink } from "react-router-dom"
import clsx from "clsx"

import { spacings, colors, radii } from "../constants"

const useStyles = makeStyles({
  root: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: `${spacings.small} ${spacings.xSmall} ${spacings.small} ${spacings.xxLarge}`,
    marginLeft: `-${spacings.xxSmall}`,
    borderTopRightRadius: radii.border,
    borderBottomRightRadius: radii.border,
    textAlign: "left",
    textDecoration: "none",
    color: colors.text,
    fontSize: 16,
    "&:hover": {
      background: colors.main,
      color: colors.white,
    },
  },
})

export default ({ children, ...other }) => {
  const classes = useStyles()

  return (
    <NavLink
      {...other}
      className={clsx(classes.root, classes)}
      activeStyle={{
        background: colors.main,
        color: colors.white,
        fontSize: 16,
      }}
    >
      {children}
    </NavLink>
  )
}
