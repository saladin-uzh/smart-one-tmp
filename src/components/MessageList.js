import _ from "lodash"
import React, { useState, useEffect } from "react"

import { List, Card, CardContent, CardHeader } from "@material-ui/core"

import { SearchAutoSuggest, MessageListItem } from "."
import { spacings, colors } from "../constants"
import { NotificationsRounded } from "@material-ui/icons"
import { CardTilte } from "../ui"

export default ({ messages: initialMessages, onDelete }) => {
  const [messages, setMessages] = useState(initialMessages)
  const [filteredMessages, setFilteredMessages] = useState(initialMessages)

  useEffect(() => {
    setMessages(initialMessages)
    setFilteredMessages(initialMessages)
  }, [initialMessages])

  const handleSearchChange = (selectedMessageId) => {
    console.log(selectedMessageId)

    if (!Boolean(selectedMessageId)) setFilteredMessages(initialMessages)
    else {
      const foundMessages = messages.find((m) => m.id === selectedMessageId)

      setFilteredMessages([foundMessages])
    }
  }

  const handleDelete = (entity) => onDelete(entity)

  return (
    <Card>
      <CardHeader
        title={<CardTilte icon={NotificationsRounded} text="Notifications" />}
        action={
          <SearchAutoSuggest
            type="messages"
            onSearchChange={handleSearchChange}
            options={messages}
            label="Unit number, riser, floor"
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
