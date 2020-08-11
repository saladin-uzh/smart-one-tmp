import React, { Component } from 'react'

import { Dialog, Button, Fab, TextField } from '@material-ui/core'
import { Add as ContentAdd } from '@material-ui/icons'

import { AutoCompleteToAddress } from '.'

export default class ComposeMessageDialog extends Component {
  constructor(props) {
    super(props)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleSend = this.handleSend.bind(this)
    this.updateToAddress = this.updateToAddress.bind(this)
    this.updateMessage = this.updateMessage.bind(this)
    this.updateSubject = this.updateSubject.bind(this)
    this.state = {
      open: this.props.open,
      to: [],
      message: '',
      subject: '',
      autoCompleteTo: this.props.addresses,
    }
  }

  updateToAddress(newAddress) {
    console.log('setting new addresses', newAddress)
    this.setState({ to: newAddress })
  }

  updateMessage(event, newMessage) {
    this.setState({ message: newMessage })
  }

  updateSubject(event, newSubject) {
    this.setState({ subject: newSubject })
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  handleSend = () => {
    this.forceUpdate()
    this.props.onSend(
      this.props.buildingId,
      this.state.to,
      this.state.subject,
      this.state.message
    )
    this.setState({ open: false })
  }

  render() {
    const actions = [
      <Button
        key="cancel"
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <Button
        key="send"
        label="Send"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleSend}
      />,
    ]

    return (
      <div>
        <Dialog
          title="Compose Message"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <AutoCompleteToAddress
            addressOptions={this.props.addressOptions}
            handleAddressUpdate={this.updateToAddress}
          />
          <br />

          <TextField
            floatingLabelText="Subject"
            floatingLabelFixed={true}
            multiLine={true}
            rows={2}
            rowsMax={8}
            fullWidth={true}
            onChange={this.updateSubject}
          />
          <TextField
            floatingLabelText="Message"
            floatingLabelFixed={true}
            multiLine={true}
            rows={2}
            rowsMax={8}
            fullWidth={true}
            onChange={this.updateMessage}
          />
        </Dialog>
        <Fab
          style={{ position: 'absolute', right: '20px' }}
          onClick={this.handleOpen}
        >
          <ContentAdd />
        </Fab>
      </div>
    )
  }
}