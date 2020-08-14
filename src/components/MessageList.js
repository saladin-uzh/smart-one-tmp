import _ from "lodash"
import React, { useState, useEffect } from "react"

import { List, Card, CardContent, CardHeader } from "@material-ui/core"

import { SearchAutoSuggest, MessageListItem } from "."
import { spacings, colors } from "../constants"

export default ({ messages: initialMessages, onDelete }) => {
  const [messages, setMessages] = useState(initialMessages)
  const [filteredMessages, setFilteredMessages] = useState(initialMessages)

  useEffect(() => {
    setMessages(initialMessages)
    setFilteredMessages(initialMessages)
  }, [initialMessages])

  const handleSearchChange = (searchText) => {
    if (_.isEmpty(searchText)) setFilteredMessages(initialMessages)
    else {
      const foundMessages = _.filter(
        messages,
        (msg) =>
          msg.message.toLowerCase().includes(searchText.toLowerCase()) ||
          _.findIndex(msg.allSentTo, (addr) =>
            addr.toLowerCase().includes(searchText.toLowerCase())
          ) >= 0
      )

      setFilteredMessages(foundMessages)
    }
  }

  const handleDelete = (entity) => onDelete(entity)

  return (
    <Card>
      <CardHeader
        title="Notifications"
        action={
          <SearchAutoSuggest
            type="messages"
            onSearchChange={handleSearchChange}
            options={messages}
            hintText="Unit number, riser, floor"
          />
        }
      />
      <CardContent>
        <List
          style={{ padding: spacings.medium, backgroundColor: colors.whiteBg }}
        >
          {_.map(filteredMessages, (msg) => (
            <MessageListItem
              key={`h-M25_ql-${msg.sendDate}`}
              message={msg}
              onDelete={handleDelete}
            />
          ))}
        </List>
      </CardContent>
    </Card>
  )
}
