import _ from 'lodash'
import React, { Component } from 'react'

import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'

export default class EntityCrudSelectField extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 1,
    }
  }

  render() {
    return (
      <SelectField
        floatingLabelText={this.props.label}
        floatingLabelFixed={true}
        fullWidth={true}
        value={this.props.value}
        onChange={(event, index, value) => {
          this.props.handleChange(value)
        }}
      >
        {_.map(this.props.optionValues, (v) => {
          return <MenuItem value={v.value} primaryText={v.display} />
        })}
      </SelectField>
    )
  }
}
