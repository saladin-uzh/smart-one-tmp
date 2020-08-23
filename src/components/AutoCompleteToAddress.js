import _ from "lodash"
import React from "react"

import { Autocomplete, createFilterOptions } from "@material-ui/lab"
import { TextFieldNoBorder, AddressChip } from "../ui"
import { colors } from "../constants"

export default ({
  selected,
  handleAddressUpdate,
  addressOptions,
  error,
  ...props
}) => {
  const filterOptions = createFilterOptions({
    stringify: (option) => `Suite ${option}`,
  })

  const renderSelected = (selected, getTagProps) =>
    _.map(selected, (item, index) => (
      <AddressChip
        key={`39MyYqqvj${item}`}
        label={`Suite ${item}`}
        {...getTagProps({ index })}
      />
    ))

  const handleSelection = (_, selection) => handleAddressUpdate(selection)

  return (
    <Autocomplete
      value={selected}
      onChange={handleSelection}
      options={addressOptions}
      getOptionLabel={(o) => `Suite ${o}`}
      filterOptions={filterOptions}
      fullWidth
      renderInput={(params) => (
        <TextFieldNoBorder
          {...params}
          bg={colors.whiteBg}
          error={error}
          InputProps={{
            ...params.InputProps,
            style: { backgroundColor: colors.whiteBg },
          }}
        />
      )}
      renderTags={renderSelected}
      ListboxProps={{
        style: {
          backgroundColor: colors.whiteBg,
        },
      }}
      {...props}
    />
  )
}
