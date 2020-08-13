import React, { useState } from "react"

import { Dialog, Button, Fab, TextField } from "@material-ui/core"
import { Add as ContentAdd } from "@material-ui/icons"

import useForceUpdate from "../utils/useForceUpdate"

import { AutoCompleteToAddress } from "."

export default ({ open, addresses, addressOptions, onSend, buildingId }) => {
  const [isOpen, setIsOpen] = useState(open)
  const [to, setTo] = useState([])
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")
  const forceUpdate = useForceUpdate()

  const updateToAddress = (newAddress) => {
    console.log("setting new addresses", newAddress)

    setTo(newAddress)
  }

  const updateMessage = (event, newMessage) => setMessage(newMessage)

  const updateSubject = (event, newSubject) => setSubject(newSubject)

  const handleOpen = () => setIsOpen(true)

  const handleClose = () => setIsOpen(false)

  const handleSend = () => {
    forceUpdate()

    onSend(buildingId, to, subject, message)

    setIsOpen(false)
  }

  const actions = [
    <Button key="cancel" label="Cancel" primary={true} onClick={handleClose} />,
    <Button
      key="send"
      label="Send"
      primary={true}
      keyboardFocused={true}
      onClick={handleSend}
    />,
  ]

  return (
    <div>
      <Dialog
        title="Compose Message"
        actions={actions}
        modal={false}
        open={isOpen}
        onRequestClose={handleClose}
      >
        <AutoCompleteToAddress
          addressOptions={addressOptions}
          handleAddressUpdate={updateToAddress}
        />
        <br />

        <TextField
          floatingLabelText="Subject"
          floatingLabelFixed={true}
          multiLine={true}
          rows={2}
          rowsMax={8}
          fullWidth={true}
          onChange={updateSubject}
        />
        <TextField
          floatingLabelText="Message"
          floatingLabelFixed={true}
          multiLine={true}
          rows={2}
          rowsMax={8}
          fullWidth={true}
          onChange={updateMessage}
        />
      </Dialog>
      <Fab style={{ position: "absolute", right: "20px" }} onClick={handleOpen}>
        <ContentAdd />
      </Fab>
    </div>
  )
}
