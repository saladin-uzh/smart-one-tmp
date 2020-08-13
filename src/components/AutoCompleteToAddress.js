import _ from "lodash"
import React, { useState } from "react"

import { Autocomplete } from "@material-ui/lab"
import { Chip } from "@material-ui/core"

export default ({ handleAddressUpdate, addressOptions }) => {
  const [searchText, setSearchText] = useState("")
  const [selected, setSelected] = useState([])
  const [selectedChips, setSelectedChips] = useState([])

  const filterOptions = (searchText, key) => {
    if (_.isEmpty(searchText) || _.isEmpty(key)) return false

    return (
      searchText !== "" &&
      key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    )
  }

  const handleUpdateInput = (searchText) => {
    this.setState({
      searchText: searchText,
    })
  }

  const renderSelected = (selected) => {
    return _.map(selected, (item) => (
      <Chip
        style={{ display: "inline-flex", margin: "0 10px 0 0" }}
        onRequestDelete={() => {
          handleDeleteSelection(item)
        }}
      >
        {item}
      </Chip>
    ))
  }

  const handleSelection = (chosen, index) => {
    if (index !== -1) {
      let newSelected = _.concat(selected, chosen)

      setSelected(newSelected)
      setSelectedChips(renderSelected(newSelected))
      setSearchText("")

      handleAddressUpdate(
        _.uniq(
          _.flatten(
            _.map(newSelected, (s) => {
              return this.props.addressOptions[s]
            })
          )
        )
      )
    } else {
      // even if we haven't
    }
  }

  const handleDeleteSelection = (chosen) => {
    let newSelected = _.without(selected, chosen)

    setSelected(newSelected)
    setSelectedChips(this.renderSelected(newSelected))

    handleAddressUpdate(
      _.uniq(
        _.flatten(
          _.map(newSelected, (s) => {
            return addressOptions[s]
          })
        )
      )
    )
  }

  return (
    <div>
      <div style={{ width: "100%" }}>{selectedChips}</div>
      <Autocomplete
        dataSource={_.keys(addressOptions)}
        floatingLabelText="To"
        floatingLabelFixed={true}
        fullWidth={true}
        searchText={searchText}
        filter={filterOptions}
        onNewRequest={handleSelection}
        onUpdateInput={handleUpdateInput}
        listStyle={{ maxHeight: 200, overflow: "auto" }}
      />
    </div>
  )
}
