import _ from "lodash"
import React, { useState, useEffect } from "react"

import { List } from "@material-ui/core"

import { SearchAutoSuggest, MessageListItem } from "."

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
    <div>
      <SearchAutoSuggest
        onSearchChange={handleSearchChange}
        hintText="Unit number, riser, floor"
      />
      <List
        style={{
          textAlign: "left",
          height: "400px",
          maxHeight: "50%",
          overflowY: "auto",
        }}
      >
        {_.map(filteredMessages, (msg) => (
          <MessageListItem message={msg} onDelete={handleDelete} />
        ))}
      </List>
    </div>
  )
}
