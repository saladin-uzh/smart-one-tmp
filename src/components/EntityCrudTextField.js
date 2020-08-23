import React from "react"

import { TextField } from "@material-ui/core"

export default ({ label, value, handleChange, error = false, ...props }) => {
  const onChange = (event) => handleChange(event.target.value)

  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      fullWidth
      {...props}
    />
  )
}
