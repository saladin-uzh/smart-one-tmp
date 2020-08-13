import _ from "lodash"
import React, { useState } from "react"
import moment from "moment"

import {
  Divider,
  IconButton,
  ListItem,
  MenuItem,
  Avatar,
  colors,
} from "@material-ui/core"
import { MoreVert as MoreVertIcon } from "@material-ui/icons"

export default ({ onDelete, message }) => {
  const [showDetail, setShowDetail] = useState(false)

  const handleDelete = () => {
    setShowDetail(false)
    onDelete(message)
  }

  const toggleDetailShow = () => setShowDetail((showDetail) => !showDetail)

  const iconButtonElement = (
    <IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
      <MoreVertIcon color={colors.grey[400]} />
    </IconButton>
  )

  const rightIconMenu = (
    <IconButton iconButtonElement={iconButtonElement}>
      <MenuItem onClick={handleDelete}>Delete</MenuItem>
    </IconButton>
  )

  const messagelines = message.message.split("\n")

  return (
    <div>
      <div style={{ display: showDetail ? "none" : "block" }}>
        <ListItem
          leftAvatar={<Avatar>{message.type.substring(0, 1)}</Avatar>}
          rightIconButton={rightIconMenu}
          primaryText={
            <div>
              {" "}
              {message.subject}{" "}
              <div style={{ position: "absolute", right: "50px", top: "15px" }}>
                {moment.unix(message.sendDate).format("l")}
              </div>
            </div>
          }
          secondaryText={
            <p>
              <b>to suites {message.sentTo}</b>
              <br />
              {message.message}
            </p>
          }
          secondaryTextLines={2}
          onClick={toggleDetailShow}
        />
      </div>
      <div
        style={{
          display: showDetail ? "block" : "none",
          backgroundColor: "rgba(164,207,95,0.2)",
          zIndex: -1,
        }}
      >
        <ListItem
          leftAvatar={<Avatar>{message.type.substring(0, 1)}</Avatar>}
          rightIconButton={rightIconMenu}
          primaryText={
            <div>
              {" "}
              {message.subject}{" "}
              <div style={{ position: "absolute", right: "50px", top: "15px" }}>
                {moment.unix(message.sendDate).format("l")}
              </div>
            </div>
          }
          secondaryText={
            <p>
              <b>to suites {message.sentTo}</b>
              <br />
              Expires {moment.unix(message.expires).format("l")}
            </p>
          }
          secondaryTextLines={2}
          onClick={toggleDetailShow}
        />
      </div>
      <div
        style={{
          marginBottom: "20px",
          marginTop: "20px",
          display: showDetail ? "block" : "none",
        }}
      >
        {_.map(messagelines, (line) => {
          return (
            <span>
              {line}
              <br />
            </span>
          )
        })}
      </div>
      <Divider inset={false} />
    </div>
  )
}
