import React, { useState } from "react"
import moment from "moment"

import { SearchRounded } from "@material-ui/icons"
import { InputAdornment } from "@material-ui/core"
import { colors, spacings } from "../constants"
import { Autocomplete, createFilterOptions } from "@material-ui/lab"
import { TextFieldNoBorder } from "../ui"

export default ({ type, options, label, onSearchChange }) => {
  const [selected, setSelected] = useState(null)

  const filterOptions = {
    summary: createFilterOptions({
      stringify: (option) =>
        `${option.firstName} ${option.lastName} ${option.email} ${option.phone}`,
    }),
    messages: createFilterOptions({
      stringify: (option) => option.message.toLowerCase(),
    }),
  }

  const getOptionLabel = (option) => {
    switch (type) {
      case "summary":
        return `${option.firstName} ${option.lastName}`
      case "messages":
        return `"${option.subject}" on ${moment
          .unix(option.sendDate)
          .format("l")}`
      default:
        return option
    }
  }

  const handleSelection = (event, newSelected) => {
    setSelected(newSelected)

    onSearchChange(newSelected ? newSelected.id : null)
  }

  return (
    <Autocomplete
      value={selected}
      onChange={handleSelection}
      freeSolo
      options={options}
      getOptionLabel={getOptionLabel}
      filterOptions={filterOptions[type]}
      style={{ minWidth: `calc(${spacings.xxLarge} * 5)` }}
      renderInput={(params) => (
        <TextFieldNoBorder
          {...params}
          bg={colors.whiteBg}
          InputProps={{
            ...params.InputProps,
            placeholder: label,
            startAdornment: (
              <InputAdornment position="start" style={{ top: "0.25em" }}>
                <SearchRounded />
              </InputAdornment>
            ),
          }}
        />
      )}
      ListboxProps={{
        style: {
          background: colors.white,
        },
      }}
    />
  )
}
