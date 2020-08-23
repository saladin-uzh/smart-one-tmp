import React, { useState, Fragment } from "react"

import {
  Dialog,
  Button,
  Fab,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@material-ui/core"
import { Add as ContentAdd } from "@material-ui/icons"

import { AutoCompleteToAddress } from "."

export default ({ open, addressOptions, onSend, buildingId }) => {
  const [isOpen, setIsOpen] = useState(open)
  const [to, setTo] = useState([])
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")

  const updateToAddress = (newAddress) => {
    console.log("setting new addresses", newAddress)

    setTo(newAddress)
  }

  const updateMessage = (event) => setMessage(event.target.value)

  const updateSubject = (event) => setSubject(event.target.value)

  const handleOpen = () => setIsOpen(true)

  const handleClose = () => setIsOpen(false)

  const handleSend = () => {
    onSend(buildingId, to, subject, message)

    setIsOpen(false)
  }

  return (
    <Fragment>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Compose Message</DialogTitle>
        <DialogContent>
          <AutoCompleteToAddress
            addressOptions={addressOptions}
            handleAddressUpdate={updateToAddress}
          />
          <TextField
            label="Subject"
            value={subject}
            onChange={updateSubject}
            fullWidth
            required
          />
          <TextField
            label="Message"
            rows={2}
            rowsMax={8}
            value={message}
            onChange={updateMessage}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button label="Cancel" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button label="Send" onClick={handleSend}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
      <Fab style={{ position: "absolute", right: "20px" }} onClick={handleOpen}>
        <ContentAdd />
      </Fab>
    </Fragment>
  )
}
