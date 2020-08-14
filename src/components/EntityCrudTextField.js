import React from "react"

import { TextField } from "@material-ui/core"

export default ({ label, value, handleChange }) => {
  const onChange = (event) => handleChange(event.target.value)

  return <TextField label={label} value={value} onChange={onChange} fullWidth />
}
