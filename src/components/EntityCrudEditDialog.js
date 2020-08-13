import _, { property } from "lodash"
import React, { useState } from "react"

import { Dialog, Button } from "@material-ui/core"

import { EntityCrudSelectField, EntityCrudTextField } from "."

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
  const [openAlert, setOpenAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const handleOpenAlert = (message) => {
    setOpenAlert(true)
    setAlertMessage(message)
  }

  const handleCloseAlert = () => setOpenAlert(false)

  const handleSave = () => {
    const value = onEntitySave(entity)

    if (!String.isNullOrEmpty(value)) {
      handleOpenAlert(value)
    }
  }

  const handleChange = (value) =>
    setEntity(_.assign(entity, { [property.name]: value }))

  const actions = [
    <Button key="cancel" label="Cancel" primary={true} onClick={handleClose} />,
    <Button
      key="save"
      label="Save"
      primary={true}
      keyboardFocused={true}
      onClick={handleSave}
    />,
  ]

  const alertActions = [
    <Button key="ok" label="OK" primary={true} onClick={handleCloseAlert} />,
  ]

  return (
    <div>
      <Dialog
        title={title ? title : `${action} ${entityName}`}
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={handleClose}
        autoScrollBodyContent={true}
      >
        {_.map(entitySchema, (property) => {
          if (property.type === "text") {
            return (
              <EntityCrudTextField
                label={_.capitalize(property.label)}
                value={entity[property.name]}
                handleChange={handleChange}
              />
            )
          } else if (property.type === "options") {
            return (
              <EntityCrudSelectField
                label={_.capitalize(property.label)}
                value={entity[property.name]}
                optionValues={property.optionValues}
                handleChange={handleChange}
              />
            )
          }
        })}
        <Dialog
          actions={alertActions}
          modal={true}
          open={openAlert}
          onRequestClose={handleCloseAlert}
        >
          {alertMessage}
        </Dialog>
      </Dialog>
    </div>
  )
}
