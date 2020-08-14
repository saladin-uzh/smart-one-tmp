import _ from "lodash"
import React, { useState } from "react"

import {
  IconButton,
  ListItem,
  MenuItem,
  ListItemText,
  ListItemSecondaryAction,
  Grid,
} from "@material-ui/core"
import { MoreVert as MoreVertIcon } from "@material-ui/icons"
import { colors, radii, spacings } from "../constants"

export default ({ onDelete, message }) => {
  const [showDetail, setShowDetail] = useState(false)

  const handleDelete = () => {
    setShowDetail(false)
    onDelete(message)
  }

  const toggleDetailShow = () => setShowDetail((showDetail) => !showDetail)

  const iconButtonElement = (
    <IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
      <MoreVertIcon color={colors.grey} />
    </IconButton>
  )

  return (
    <ListItem
      onClick={toggleDetailShow}
      style={{
        backgroundColor: colors.white,
        borderRadius: radii.border,
        marginBottom: spacings.medium,
      }}
    >
      <ListItemText
        primary={
          <Grid container style={{ fontWeight: "bold" }}>
            <Grid item xs={6}>
              {message.subject}
            </Grid>
            <Grid
              item
              xs={6}
              style={{ color: colors.main, textAlign: "right" }}
            >
              Suite {message.sentTo}
            </Grid>
          </Grid>
        }
        secondary={message.message}
      >
        <ListItemSecondaryAction>
          <IconButton iconButtonElement={iconButtonElement}>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItemText>
    </ListItem>
  )
}
