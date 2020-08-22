import React, { useState } from "react"
import clsx from "clsx"

import { SearchRounded } from "@material-ui/icons"
import { Autocomplete, createFilterOptions } from "@material-ui/lab"
import { InputAdornment, withStyles } from "@material-ui/core"

import { colors } from "../constants"
import { TextFieldNoBorder } from "../ui"

export default withStyles({
  root: { backgroundColor: colors.white },
  fainted: { backgroundColor: colors.whiteBg },
})(
  ({
    handleAddressUpdate,
    addressOptions,
    hintText,
    classes,
    fainted = false,
  }) => {
    const [selected, setSelected] = useState(null)

    const filterOptions = createFilterOptions({
      stringify: (option) => `Suite ${option}`,
    })

    const handleSelection = (event, newSelected) => {
      const selection = Boolean(newSelected)
        ? newSelected.replace("Suite ", "")
        : null

      setSelected(selection)

      console.log("selected:", selection)

      handleAddressUpdate(selection)
    }

    return (
      <Autocomplete
        value={selected}
        onChange={handleSelection}
        options={addressOptions}
        getOptionLabel={(o) => `Suite ${o}`}
        filterOptions={filterOptions}
        renderInput={(params) => (
          <TextFieldNoBorder
            {...params}
            InputProps={{
              ...params.InputProps,
              className: clsx(
                { [classes.fainted]: fainted },
                classes,
                params.InputProps.className
              ),
              placeholder: hintText,
              startAdornment: (
                <InputAdornment position="start" style={{ top: "0.25em" }}>
                  <SearchRounded />
                </InputAdornment>
              ),
            }}
          />
        )}
        ListboxProps={{
          style: { backgroundColor: fainted ? colors.whiteBg : colors.white },
        }}
      />
    )
  }
)
