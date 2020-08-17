import _ from "lodash"
import React, { useState } from "react"

import {
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@material-ui/core"

import { EntityCrudSelectField, EntityCrudTextField } from "."
import { colors, radii } from "../constants"

export default ({
  entity: initialEntity,
  action,
  title,
  entityName,
  open,
  handleClose,
  onEntitySave,
  entitySchema,
}) => {
  const [entity, setEntity] = useState(initialEntity)
  // const [openAlert, setOpenAlert] = useState(false)
  // const [alertMessage, setAlertMessage] = useState("")

  // const handleOpenAlert = (message) => {
  //   setOpenAlert(true)
  //   setAlertMessage(message)
  // }

  // const handleCloseAlert = () => setOpenAlert(false)

  const handleSave = () => {
    onEntitySave(entity)
    handleClose()
  }
  // const handleSave = () => {
  // const value = onEntitySave(entity)

  // if (!String.isNullOrEmpty(value)) {
  // handleOpenAlert(value)
  // }
  // }

  const handleChange = (value, propertyName) => {
    console.log(value, propertyName)
    setEntity((entity) => ({ ...entity, [propertyName]: value }))
  }

  // const alertActions = [
  //   <Button key="ok" label="OK" primary={true} onClick={handleCloseAlert} />,
  // ]

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title ? title : `${action} ${entityName}`}</DialogTitle>
      <DialogContent>
        {_.map(entitySchema, (property) => {
          if (property.type === "text") {
            return (
              <EntityCrudTextField
                key={`00Nbkzvrt${property.label}`}
                label={_.capitalize(property.label)}
                value={entity[property.name]}
                handleChange={(v) => handleChange(v, property.name)}
              />
            )
          } else if (property.type === "options") {
            return (
              <EntityCrudSelectField
                key={`Q4HyXnird${property.label}`}
                label={_.capitalize(property.label)}
                value={entity[property.name]}
                optionValues={property.optionValues}
                handleChange={handleChange}
              />
            )
          }
        })}
      </DialogContent>
      <DialogActions>
        <Button
          label="Cancel"
          color="default"
          onClick={handleClose}
          style={{ color: colors.text, borderRadius: radii.borderSharp }}
        >
          Cancel
        </Button>
        <Button
          label="Add"
          onClick={handleSave}
          style={{ borderRadius: radii.borderSharp }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}
