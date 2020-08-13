import React from "react"

import { Search } from "@material-ui/icons"
import { TextField } from "@material-ui/core"

export default ({ style, hintText, onSearchChange }) => {
  const handleChange = (e) => onSearchChange(e.target.value)

  return (
    <div style={style}>
      <Search style={{ marginRight: 24 }} />
      <TextField onChange={handleChange} hintText={hintText} />
    </div>
  )
}
