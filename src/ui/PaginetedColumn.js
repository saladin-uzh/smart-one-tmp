import React, { useState, useEffect } from "react"
import _ from "lodash"

import { TableCell, IconButton, withStyles, Grid } from "@material-ui/core"
import { ArrowBackIosRounded, ArrowForwardIosRounded } from "@material-ui/icons"
import { colors, spacings } from "../constants"

export default withStyles({
  withButtons: {
    alignItems: "center",
    justifyContent: "space-between",

    "& .MuiIconButton-root": {
      backgroundColor: colors.main,
      color: colors.white,
      bottom: ".1em",

      "& .MuiSvgIcon-root": {
        fontSize: spacings.small,
        fontWeight: "bold",
      },
    },
  },
})(({ entities, classes, onChange }) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    onChange(entities[current])
  }, [current])

  const handleNextClick = () =>
    setCurrent((current) => (current === entities.length - 1 ? 0 : ++current))

  const handlePrevClick = () =>
    setCurrent((current) => (current === 0 ? entities.length - 1 : --current))

  return (
    <TableCell className={classes.withButtons}>
      <Grid container alignItems="center" justify="space-between">
        <IconButton size="small" onClick={handlePrevClick}>
          <ArrowBackIosRounded />
        </IconButton>
        {_.capitalize(entities[current])}
        <IconButton size="small" onClick={handleNextClick}>
          <ArrowForwardIosRounded />
        </IconButton>
      </Grid>
    </TableCell>
  )
})
