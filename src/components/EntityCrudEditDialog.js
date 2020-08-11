import _ from 'lodash'
import React, { Component } from 'react'

import { Dialog, Button } from '@material-ui/core'

import { EntityCrudSelectField, EntityCrudTextField } from '.'

export default class EntityCrudEditDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      entity: this.props.entity,
      action: this.props.action,
      openAlert: false,
      AlertMessage: '',
    }
    this.handleOpenAlert = this.handleOpenAlert.bind(this)
    this.handleCloseAlert = this.handleCloseAlert.bind(this)
  }

  handleOpenAlert(alertMessage) {
    this.setState({ openAlert: true, AlertMessage: alertMessage })
  }

  handleCloseAlert() {
    this.setState({ openAlert: false })
  }

  render() {
    const actions = [
      <Button
        key="cancel"
        label="Cancel"
        primary={true}
        onClick={this.props.handleClose}
      />,
      <Button
        key="save"
        label="Save"
        primary={true}
        keyboardFocused={true}
        onClick={() => {
          var value = this.props.onEntitySave(this.state.entity)
          if (!String.isNullOrEmpty(value)) {
            this.handleOpenAlert(value)
          }
        }}
      />,
    ]

    const alertActions = [
      <Button
        key="ok"
        label="OK"
        primary={true}
        onClick={this.handleCloseAlert}
      />,
    ]

    const component = this

    return (
      <div>
        <Dialog
          title={
            this.props.title
              ? this.props.title
              : `${this.state.action} ${this.props.entityName}`
          }
          actions={actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
          autoScrollBodyContent={true}
        >
          {_.map(this.props.entitySchema, (property) => {
            if (property.type === 'text') {
              return (
                <EntityCrudTextField
                  label={_.capitalize(property.label)}
                  value={component.state.entity[property.name]}
                  handleChange={(value) => {
                    let valueObj = {}
                    valueObj[property.name] = value
                    component.setState({
                      entity: _.assign(component.state.entity, valueObj),
                    })
                  }}
                />
              )
            } else if (property.type === 'options') {
              return (
                <EntityCrudSelectField
                  label={_.capitalize(property.label)}
                  value={component.state.entity[property.name]}
                  optionValues={property.optionValues}
                  handleChange={(value) => {
                    let valueObj = {}
                    valueObj[property.name] = value
                    component.setState({
                      entity: _.assign(component.state.entity, valueObj),
                    })
                  }}
                />
              )
            }
          })}
          <Dialog
            actions={alertActions}
            modal={true}
            open={this.state.openAlert}
            onRequestClose={this.handleCloseAlert}
          >
            {this.state.AlertMessage}
          </Dialog>
        </Dialog>
      </div>
    )
  }
}
