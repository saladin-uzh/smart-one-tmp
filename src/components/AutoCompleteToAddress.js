import _ from "lodash"
import React, { useState, Fragment, useEffect } from "react"

import { Autocomplete, createFilterOptions } from "@material-ui/lab"
import { Chip } from "@material-ui/core"
import { TextFieldNoBorder } from "../ui"
import { colors, spacings } from "../constants"

export default ({ handleAddressUpdate, addressOptions }) => {
  // const [searchText, setSearchText] = useState("")
  const [selected, setSelected] = useState([])
  const [selectedChips, setSelectedChips] = useState([])

  useEffect(() => {
    handleAddressUpdate(selectedChips)
  }, [selectedChips])

  const filterOptions = createFilterOptions({
    stringify: (option) => `Suite ${option}`,
  })

  const renderSelected = (selected) => {
    return _.map(selected, (item) => (
      <Chip
        key={`39MyYqqvj${item}`}
        label={`Suite ${item}`}
        style={{
          backgroundColor: colors.whiteBg,
          margin: `${spacings.xSmall} ${spacings.xxSmall} 0 0`,
          padding: ".3em",
        }}
        onDelete={() => {
          handleDeleteSelection(item)
        }}
      />
    ))
  }

  const handleSelection = (event, selection) => {
    if (selection) {
      setSelected(selection)
      setSelectedChips((selectedChips) =>
        _.uniq(_.flatten([...selectedChips, selection]))
      )
    }
  }
  // const handleSelection = (chosen, index) => {
  //   if (index !== -1) {
  //     let newSelected = _.concat(selected, chosen)

  //     setSelected(newSelected)
  //     setSelectedChips(renderSelected(newSelected))
  //     setSearchText("")

  //     handleAddressUpdate(
  //       _.uniq(_.flatten(_.map(newSelected, (s) => addressOptions[s])))
  //     )
  //   } else {
  //     // even if we haven't
  //   }
  // }

  const handleDeleteSelection = (chosen) => {
    setSelectedChips((selectedChips) => _.without(selectedChips, chosen))

    // handleAddressUpdate(
    //   _.uniq(
    //     _.flatten(
    //       _.map(newSelected, (s) => {
    //         return addressOptions[s]
    //       })
    //     )
    //   )
    // )
  }

  // const updateSearchText = (event, newText) => setSearchText(newText)

  return (
    <Fragment>
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
            InputProps={{
              ...params.InputProps,
              style: { backgroundColor: colors.whiteBg },
            }}
          />
        )}
        ListboxProps={{
          style: {
            background: colors.white,
          },
        }}
      />
      {renderSelected(selectedChips)}
    </Fragment>
  )
}
