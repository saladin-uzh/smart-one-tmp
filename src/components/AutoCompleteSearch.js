import _ from 'lodash'
import React, { Component } from 'react'

import Search from 'material-ui/svg-icons/action/search'
import AutoComplete from 'material-ui/AutoComplete'

export default class AutoCompleteSearch extends Component {
  constructor(props) {
    super(props)
    this.filterOptions = this.filterOptions.bind(this)
    this.handleUpdateInput = this.handleUpdateInput.bind(this)
    this.handleSelection = this.handleSelection.bind(this)
    this.state = {
      searchText: '',
      selected: [],
    }
  }

  filterOptions(searchText, key) {
    if (_.isEmpty(searchText) || _.isEmpty(key)) {
      return false
    }

    let searchTextWords = searchText.toLowerCase().split(' ')
    let lowerKey = key.toLowerCase()
    return _.reduce(
      searchTextWords,
      (found, word) => {
        return found || lowerKey.indexOf(word) !== -1
      },
      false
    )
  }

  handleUpdateInput(searchText) {
    this.setState({
      searchText: searchText,
    })
  }

  handleSelection(chosen, index) {
    if (index !== -1) {
      this.setState({
        selected: chosen,
        searchText: '',
      })
      console.log('selected:', chosen)
      this.props.handleAddressUpdate(this.props.addressOptions[chosen])
    }
  }

  render() {
    return (
      <div>
        <Search style={{ marginRight: 24 }} />
        <AutoComplete
          dataSource={_.keys(this.props.addressOptions)}
          searchText={this.state.searchText}
          hintText={this.props.hintText}
          filter={this.filterOptions}
          onNewRequest={this.handleSelection}
          onUpdateInput={this.handleUpdateInput}
        />
      </div>
    )
  }
}
