import _ from 'lodash'
import React, { Component } from 'react'

import AutoComplete from 'material-ui/AutoComplete'
import Chip from 'material-ui/Chip'

export default class AutoCompleteToAddress extends Component {
  constructor(props) {
    super(props)
    this.filterOptions = this.filterOptions.bind(this)
    this.handleUpdateInput = this.handleUpdateInput.bind(this)
    this.renderSelected = this.renderSelected.bind(this)
    this.handleSelection = this.handleSelection.bind(this)
    this.handleDeleteSelection = this.handleDeleteSelection.bind(this)
    this.state = {
      searchText: '',
      selected: [],
      selectedChips: [],
    }
  }

  filterOptions(searchText, key) {
    if (_.isEmpty(searchText) || _.isEmpty(key)) {
      return false
    }
    return (
      searchText !== '' &&
      key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    )
    //let searchTextWords = searchText.toLowerCase().split(' ');
    //let lowerKey = key.toLowerCase();
    //return _.reduce(searchTextWords, (found, word)=> {return found || lowerKey.indexOf(word) !== -1}, false);
  }

  handleUpdateInput(searchText) {
    this.setState({
      searchText: searchText,
    })
  }

  renderSelected(selected) {
    return _.map(selected, (item) => {
      return (
        <Chip
          style={{ display: 'inline-flex', margin: '0 10px 0 0' }}
          onRequestDelete={() => {
            this.handleDeleteSelection(item)
          }}
        >
          {item}
        </Chip>
      )
    })
  }

  handleSelection(chosen, index) {
    if (index !== -1) {
      let selected = this.state.selected
      let newSelected = _.concat(selected, chosen)
      this.setState({
        selected: newSelected,
        selectedChips: this.renderSelected(newSelected),
        searchText: '',
      })
      this.props.handleAddressUpdate(
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

  handleDeleteSelection(chosen) {
    let newSelected = _.without(this.state.selected, chosen)
    this.setState({
      selected: newSelected,
      selectedChips: this.renderSelected(newSelected),
    })
    this.props.handleAddressUpdate(
      _.uniq(
        _.flatten(
          _.map(newSelected, (s) => {
            return this.props.addressOptions[s]
          })
        )
      )
    )
  }

  render() {
    return (
      <div>
        <div style={{ width: '100%' }}>{this.state.selectedChips}</div>
        <AutoComplete
          dataSource={_.keys(this.props.addressOptions)}
          floatingLabelText="To"
          floatingLabelFixed={true}
          fullWidth={true}
          searchText={this.state.searchText}
          filter={this.filterOptions}
          onNewRequest={this.handleSelection}
          onUpdateInput={this.handleUpdateInput}
          listStyle={{ maxHeight: 200, overflow: 'auto' }}
        />
      </div>
    )
  }
}
