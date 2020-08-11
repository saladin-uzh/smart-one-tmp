import React, { Component } from 'react'

import Search from 'material-ui/svg-icons/action/search'
import TextField from 'material-ui/TextField'

export default class SearchAutoSuggest extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    this.props.onSearchChange(e.target.value)
  }

  render() {
    return (
      <div style={this.props.style}>
        <Search style={{ marginRight: 24 }} />
        <TextField
          onChange={this.handleChange}
          hintText={this.props.hintText}
        />
      </div>
    )
  }
}
