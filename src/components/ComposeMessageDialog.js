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

const initialErrors = {
  to: false,
  subject: false,
  message: false,
}

export default ({ addressOptions, onSend, buildingId, handleError }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [to, setTo] = useState([])
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")
  const [errors, setErrors] = useState(initialErrors)

  const updateToAddress = (newAddresses) => {
    setTo(newAddresses)
    if (errors.to && to.length > 0)
      setErrors((errors) => ({ ...errors, to: false }))
  }

  const updateMessage = (event) => {
    setMessage(event.target.value)
    if (errors.message) setErrors((errors) => ({ ...errors, message: false }))
  }

  const updateSubject = (event) => {
    setSubject(event.target.value)
    if (errors.subject) setErrors((errors) => ({ ...errors, subject: false }))
  }

  const handleOpen = () => setIsOpen(true)

  const handleClose = () => {
    setTo([])
    setSubject("")
    setMessage("")
    setErrors(initialErrors)
    setIsOpen(false)
  }

  const handleSend = () => {
    if (to.length > 0 && Boolean(subject) && Boolean(message)) {
      onSend(buildingId, to, subject, message)
      handleClose()
    } else {
      let errorText = "Unable to send message\r\n"
      const newErrors = errors

      if (to.length === 0) {
        errorText += "\r\nAddress is empty!"
        newErrors.to = true
      }

      if (!Boolean(subject)) {
        errorText += "\r\nSubject is empty!"
        newErrors.subject = true
      }

      if (!Boolean(message)) {
        errorText += "\r\nMessage is empty!"
        newErrors.message = true
      }

      setErrors(newErrors)

      handleError(errorText)
    }
  }

  return (
    <Fragment>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Compose Message</DialogTitle>
        <DialogContent>
          <AutoCompleteToAddress
            addressOptions={addressOptions}
            selected={to}
            handleAddressUpdate={updateToAddress}
            error={errors.to}
            multiple
            filterSelectedOptions
          />
          <TextField
            label="Subject"
            value={subject}
            onChange={updateSubject}
            error={errors.subject}
            fullWidth
            required
          />
          <TextField
            label="Message"
            rows={1}
            rowsMax={8}
            value={message}
            onChange={updateMessage}
            error={errors.message}
            multiline
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button label="Cancel" color="default" onClick={handleClose}>
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
