import _ from "lodash"
import React, { useState } from "react"

import { Search } from "@material-ui/icons"
import { Autocomplete } from "@material-ui/lab"

export default ({ handleAddressUpdate, addressOptions, hintText }) => {
  // const [selected, setSelected] = useState([])
  const [searchText, setSearchText] = useState([])

  const filterOptions = (searchText, key) => {
    if (_.isEmpty(searchText) || _.isEmpty(key)) {
      return false
    }

    let searchTextWords = searchText.toLowerCase().split(" ")
    let lowerKey = key.toLowerCase()
    return _.reduce(
      searchTextWords,
      (found, word) => {
        return found || lowerKey.indexOf(word) !== -1
      },
      false
    )
  }

  const handleUpdateInput = (searchText) => setSearchText(searchText)

  const handleSelection = (chosen, index) => {
    if (index !== -1) {
      // setSelected(chosen)
      setSearchText("")

      console.log("selected:", chosen)
      handleAddressUpdate(addressOptions[chosen])
    }
  }

  return (
    <div>
      <Search style={{ marginRight: 24 }} />
      <Autocomplete
        dataSource={_.keys(addressOptions)}
        value={searchText}
        hintText={hintText}
        filterOptions={filterOptions}
        onNewRequest={handleSelection}
        onUpdateInput={handleUpdateInput}
      />
    </div>
  )
}
