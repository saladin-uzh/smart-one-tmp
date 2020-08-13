import _ from "lodash"
import React from "react"

import { MenuItem, Select } from "@material-ui/core"

export default ({ value, label, handleChange, optionValues }) => {
  const onChange = (event, index, value) => handleChange(value)

  return (
    <Select
      floatingLabelText={label}
      floatingLabelFixed={true}
      fullWidth={true}
      value={value}
      onChange={onChange}
    >
      {_.map(optionValues, ({ value, display }) => (
        <MenuItem value={value} primaryText={display} />
      ))}
    </Select>
  )
}
