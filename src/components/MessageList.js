import _ from 'lodash'
import React, { Component } from 'react'

import { List } from '@material-ui/core'

import { SearchAutoSuggest, MessageListItem } from '.'

export default class MessageList extends Component {
  constructor(props) {
    super(props)
    if (props.sendMessage) {
      this.sendMessage = props.sendMessage.bind(this)
    }
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.state = {
      messages: props.messages,
      filteredMessages: props.messages,
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      messages: props.messages,
      filteredMessages: props.messages,
    })
  }

  handleSearchChange(searchText) {
    if (_.isEmpty(searchText)) {
      this.setState({ filteredMessages: this.state.messages })
    } else {
      let foundMessages = _.filter(this.state.messages, (msg) => {
        return (
          msg.message.toLowerCase().includes(searchText.toLowerCase()) ||
          _.findIndex(msg.allSentTo, (addr) => {
            return addr.toLowerCase().includes(searchText.toLowerCase())
          }) >= 0
        )
      })
      this.setState({ filteredMessages: foundMessages })
    }
  }

  handleDelete(entity) {
    this.props.onDelete(entity)
  }

  render() {
    return (
      <div>
        <SearchAutoSuggest
          onSearchChange={this.handleSearchChange}
          hintText="Unit number, riser, floor"
        />
        <List
          style={{
            textAlign: 'left',
            height: '400px',
            maxHeight: '50%',
            overflowY: 'auto',
          }}
        >
          {_.map(this.state.filteredMessages, (msg) => {
            return (
              <MessageListItem message={msg} onDelete={this.handleDelete} />
            )
          })}
        </List>
      </div>
    )
  }
}
