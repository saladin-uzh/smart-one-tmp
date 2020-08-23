import React, { Fragment, useState } from "react"
import { Dialog, DialogActions, DialogContent, Button } from "@material-ui/core"
import { spacings } from "../constants"

export default (WrappedComponent) => (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleError = (msg) => {
    if (Boolean(msg) && msg !== errorMessage) {
      setIsOpen(true)
      setErrorMessage(msg)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setErrorMessage("")
  }

  return (
    <Fragment>
      <WrappedComponent handleError={handleError} {...props} />
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogContent>
          <pre>{errorMessage}</pre>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ padding: spacings.xxSmall }}
            label="Ok"
            onClick={handleClose}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}
