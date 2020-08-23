import React from "react"
// import clsx from "clsx"

import { Chip, withStyles } from "@material-ui/core"
import { colors, spacings } from "../constants"

export default withStyles(({ shadows }) => ({
  AddressChip: {
    backgroundColor: colors.main,
    color: colors.white,
    padding: `${spacings.xxSmall} 0`,
    margin: `${spacings.xxSmall} ${spacings.xSmall} ${spacings.xxSmall} 0`,
    fontWeight: "bold",

    "&:last-child": {
      marginRight: 0,
    },

    "& .MuiChip-deleteIcon": {
      color: colors.white,
    },

    "&:hover": {
      boxShadow: shadows[0],
    },
  },
}))(({ classes, ...props }) => (
  <Chip {...props} className={classes.AddressChip} />
))
