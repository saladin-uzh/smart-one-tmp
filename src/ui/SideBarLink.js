import React from "react"
import { makeStyles } from "@material-ui/core"
import { NavLink } from "react-router-dom"
import clsx from "clsx"

import { spacings, colors, radii } from "../constants"

const useStyles = makeStyles({
  root: {
    display: "flex",
    height: "100%",
    width: "85%",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: `${spacings.small} ${spacings.xSmall} ${spacings.small} ${spacings.xxLarge}`,
    marginLeft: `-${spacings.xxSmall}`,
    borderTopRightRadius: radii.border,
    borderBottomRightRadius: radii.border,
    textAlign: "left",
    textDecoration: "none",
    color: colors.text,
    fontSize: "1.3rem",
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
      className={clsx(classes.root, ...classes)}
      activeStyle={{
        background: colors.main,
        color: colors.white,
      }}
    >
      {children}
    </NavLink>
  )
}
