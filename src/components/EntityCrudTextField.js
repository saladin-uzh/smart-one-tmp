import React, { Component } from 'react'

import { TextField } from '@material-ui/core'

export default class EntityCrudTextField extends Component {
  render() {
    return (
      <TextField
        floatingLabelText={this.props.label}
        floatingLabelFixed={true}
        multiLine={true}
        rows={1}
        fullWidth={true}
        value={this.props.value}
        onChange={(event, value) => {
          this.props.handleChange(value)
        }}
      />
    )
  }
}
