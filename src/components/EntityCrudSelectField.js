import _ from "lodash"
import React from "react"

import { MenuItem } from "@material-ui/core"
import { TextFieldUI } from "../ui"

export default ({ value, label, handleChange, optionValues, ...props }) => (
  <TextFieldUI
    label={label}
    value={value}
    onChange={handleChange}
    select
    {...props}
  >
    {_.map(optionValues, ({ value: oValue, display }) => (
      <MenuItem key={`M3vBj9Kgb${oValue}`} value={oValue}>
        {display}
      </MenuItem>
    ))}
  </TextFieldUI>
)