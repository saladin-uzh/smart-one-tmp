import _ from "lodash"
import React, { useState } from "react"

import {
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@material-ui/core"

import {
  EntityCrudSelectField,
  EntityCrudTextField,
  AutoCompleteToAddress,
} from "."
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
  handleError,
}) => {
  const [entity, setEntity] = useState(initialEntity)
  const [errors, setErrors] = useState(
    Object.assign({}, ...entitySchema.map(({ name }) => ({ [name]: false })))
  )

  const handleSave = () => {
    let detectedErrors = errors

    entitySchema.forEach(({ name }) => {
      if (!Boolean(entity[name])) detectedErrors[name] = true
      else if (detectedErrors[name]) detectedErrors[name] = false
    })

    setErrors(detectedErrors)

    if (!Object.values(errors).includes(true)) {
      onEntitySave(entity)
      handleClose()
    } else {
      const errorSubject = entityName.toLowerCase()
      const errorParts = Object.entries(errors)
        .filter((pair) => pair[1])
        .map(
          ([prop, __]) =>
            `${_.capitalize(
              entitySchema.find(({ name }) => name === prop).label
            )} is missing!`
        )
        .join("\r\n")

      handleError(`Unable to add ${errorSubject}\r\n\r\n${errorParts}`)
    }
  }

  const handleChange = (value, propertyName) => {
    if (errors[propertyName])
      setErrors((errors) => ({ ...errors, [propertyName]: false }))
    setEntity((entity) => ({ ...entity, [propertyName]: value }))
  }

  return (
    <Dialog open={open} onClose={handleClose} style={{ minWidth: 300 }}>
      <DialogTitle>{title ? title : `${action} ${entityName}`}</DialogTitle>
      <DialogContent>
        {_.map(entitySchema, (property) => {
          const onChange = (value) => handleChange(value, property.name)

          if (property.type === "text") {
            return (
              <EntityCrudTextField
                key={`00Nbkzvrt${property.name}`}
                label={_.capitalize(property.label)}
                value={entity[property.name]}
                error={errors[property.name]}
                handleChange={onChange}
                required
              />
            )
          } else if (property.type === "options") {
            return (
              <EntityCrudSelectField
                key={`Q4HyXnird${property.name}`}
                label={_.capitalize(property.label)}
                value={entity[property.name]}
                optionValues={property.optionValues}
                error={errors[property.name]}
                handleChange={onChange}
                required
              />
            )
          } else if (property.type === "address") {
            return (
              <AutoCompleteToAddress
                key={`4MMvFxRJH${property.name}`}
                addressOptions={property.optionValues}
                selected={entity[property.name]}
                handleAddressUpdate={onChange}
                error={errors[property.name]}
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
