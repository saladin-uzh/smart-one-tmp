import React, { useState } from "react"

import { SearchRounded } from "@material-ui/icons"
import { InputAdornment } from "@material-ui/core"
import { colors, spacings } from "../constants"
import { Autocomplete, createFilterOptions } from "@material-ui/lab"
import { TextFieldNoBorder } from "../ui"

export default ({ type, options, label, onSearchChange }) => {
  const [selected, setSelected] = useState(null)

  const filterOptions = {
    poeople: createFilterOptions({
      stringify: (option) =>
        Object.keys(option)
          .map((o) => option[o].toLowerCase())
          .join(" "),
    }),
    ownership: createFilterOptions({
      stringify: (option) => `${option.type} ${option.suite}`,
    }),
    dir: createFilterOptions({
      stringify: (option) => option.name,
    }),
    occupants: createFilterOptions({
      stringify: (option) =>
        `${option.firstName} ${option.lastName} ${option.email} ${option.phone}`,
    }),
    messages: createFilterOptions({
      stringify: (option) =>
        [
          option.message.toLowerCase(),
          option.allSentTo.join(" "),
          option.subject.toLowerCase(),
        ].join(" "),
    }),
  }

  const getOptionLabel = (option) => {
    switch (type) {
      case "people":
        return `${option.firstName} ${option.lastName}`
      case "ownership":
        return `Suite ${option.suite}: ${option.type.toLowerCase()} `
      case "dir":
        return option.name
      case "occupants":
        return `${option.firstName} ${option.lastName}`
      case "messages":
        return `"${option.subject}" to ${option.sentTo}`
      default:
        return option
    }
  }

  const handleSelection = (_, newSelected) => {
    setSelected(newSelected)

    onSearchChange(newSelected ? newSelected.id : null)
  }

  return (
    <Autocomplete
      value={selected}
      onChange={handleSelection}
      options={options}
      getOptionLabel={getOptionLabel}
      filterOptions={filterOptions[type]}
      style={{ minWidth: `calc(${spacings.xxLarge} * 7)` }}
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
          background: colors.whiteBg,
        },
      }}
    />
  )
}
