import _ from 'lodash'
import React, { Component } from 'react'
import moment from 'moment'

import { ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import { grey400 /**, darkBlack, lightBlack*/ } from 'material-ui/styles/colors'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'

export default class MessageListItem extends Component {
  constructor(props) {
    super(props)
    this.handleDelete = this.handleDelete.bind(this)
    this.state = {
      buildingId: this.props.buildingId,
      showDetail: false,
    }
  }

  handleDelete() {
    this.setState({ showDetail: false })
    this.props.onDelete(this.props.message)
  }

  render() {
    const iconButtonElement = (
      <IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
        <MoreVertIcon color={grey400} />
      </IconButton>
    )

    const rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem onClick={this.handleDelete}>Delete</MenuItem>
      </IconMenu>
    )

    const messagelines = this.props.message.message.split('\n')

    return (
      <div>
        <div style={{ display: this.state.showDetail ? 'none' : 'block' }}>
          <ListItem
            leftAvatar={
              <Avatar>{this.props.message.type.substring(0, 1)}</Avatar>
            }
            rightIconButton={rightIconMenu}
            primaryText={
              <div>
                {' '}
                {this.props.message.subject}{' '}
                <div
                  style={{ position: 'absolute', right: '50px', top: '15px' }}
                >
                  {moment.unix(this.props.message.sendDate).format('l')}
                </div>
              </div>
            }
            secondaryText={
              <p>
                <b>to suites {this.props.message.sentTo}</b>
                <br />
                {this.props.message.message}
              </p>
            }
            secondaryTextLines={2}
            onClick={() => {
              this.setState({ showDetail: !this.state.showDetail })
            }}
          />
        </div>
        <div
          style={{
            display: this.state.showDetail ? 'block' : 'none',
            backgroundColor: 'rgba(164,207,95,0.2)',
            zIndex: -1,
          }}
        >
          <ListItem
            leftAvatar={
              <Avatar>{this.props.message.type.substring(0, 1)}</Avatar>
            }
            rightIconButton={rightIconMenu}
            primaryText={
              <div>
                {' '}
                {this.props.message.subject}{' '}
                <div
                  style={{ position: 'absolute', right: '50px', top: '15px' }}
                >
                  {moment.unix(this.props.message.sendDate).format('l')}
                </div>
              </div>
            }
            secondaryText={
              <p>
                <b>to suites {this.props.message.sentTo}</b>
                <br />
                Expires {moment.unix(this.props.message.expires).format('l')}
              </p>
            }
            secondaryTextLines={2}
            onClick={() => {
              this.setState({ showDetail: !this.state.showDetail })
            }}
          />
        </div>
        <div
          style={{
            marginBottom: '20px',
            marginTop: '20px',
            display: this.state.showDetail ? 'block' : 'none',
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
}
