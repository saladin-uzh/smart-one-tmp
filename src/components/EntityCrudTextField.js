import React from "react"

import { TextField } from "@material-ui/core"

export default ({ label, value, handleChange }) => {
  const onChange = (event, value) => {
    handleChange(value)
  }

  return (
    <TextField
      floatingLabelText={label}
      floatingLabelFixed={true}
      multiLine={true}
      rows={1}
      fullWidth={true}
      value={value}
      onChange={onChange}
    />
  )
}
