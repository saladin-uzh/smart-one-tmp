import _ from 'lodash'
import React, { Component } from 'react'

import { List } from 'material-ui/List'

import { SearchAutoSuggest, MessageListItem } from '.'

export default class MessageList extends Component {
  constructor(props) {
    super(props)
    //if (props.getMessages) {
    //  this.getMessages = props.getMessages.bind(this);
    //}
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

  //componentDidMount() {
  //  //const component = this;
  //  //global.externalApi.getNotifications().then((data)=> {
  //  //  const notifications = _.map(data, (msg) => {
  //  //    console.log('message', msg)
  //  //    const allAddressees = _.uniq(_.map(msg.m_house, (addr)=> {
  //  //      return addr.House.split('-')[1]
  //  //    }));
  //  //    const displayAddressees = msg.m_house.length > 4 ? `${allAddressees[0]}, ${allAddressees[1]}, ${allAddressees[2]} and ${allAddressees.length - 3} others` : _.sum(_.map(allAddressees, (a)=>{return a + ' '}));
  //  //    return {
  //  //      subject: msg.m_subject,
  //  //      type: msg.m_type,
  //  //      message: msg.m_content,
  //  //      allSentTo: allAddressees,
  //  //      sentTo: displayAddressees,
  //  //      sendDate: moment(msg.m_wdate, 'YYYYMMDDHHmm').unix(),
  //  //      expires: moment(msg.m_edate, "YYYYMMDDHHmm").unix()
  //  //    }
  //  //  });
  //  //  component.setState({messages: notifications, filteredMessages: notifications});
  //  //  console.log('getMessages', notifications)
  //  //});
  //    //this.getMessages().then(function (messages) {
  //    //  component.setState({messages: messages, filteredMessages: messages});
  //    //})
  //}
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
