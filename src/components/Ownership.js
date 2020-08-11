import _ from 'lodash'
import React, { Component } from 'react'

import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui-next/Grid'
import DatePicker from 'material-ui/DatePicker'
import Dialog from 'material-ui/Dialog'

import {
  AutoCompleteSearch,
  EntityCrudSummaryCard,
  EntityCrudSelectField,
} from '.'

export default class Ownership extends Component {
  constructor(props) {
    super(props)
    this.getOwnershipTypes = this.getOwnershipTypes.bind(this)
    this.getOwnershipPersonTypes = this.getOwnershipPersonTypes.bind(this)
    this.getOwnershipByNumber = this.getOwnershipByNumber.bind(this)
    this.getunitId = this.getunitId.bind(this)
    this.handlePersonSave = this.handlePersonSave.bind(this)
    this.handlePersonDelete = this.handlePersonDelete.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.getUnits = this.getUnits.bind(this)
    this.getunitId = this.getunitId.bind(this)
    this.handleOwnershipUnitSave = this.handleOwnershipUnitSave.bind(this)
    this.handleOwnershipUnitDelete = this.handleOwnershipUnitDelete.bind(this)
    this.handleOwnershipSave = this.handleOwnershipSave.bind(this)
    this.handleTransfer = this.handleTransfer.bind(this)
    this.state = {
      ownership: {
        id: 1,
        activateDate: new Date(),
        inactivateDate: new Date(),
        typeId: 0,
        notes: '',
        avtive: true,
        people: [],
        properties: [],
      },
      unitNumber: '',
      unitId: '',
      buildingId: '',
      emptyPeople: {},
      emptyproperty: {},
      units: [],
      ownershipTypes: [],
      ownershipPersonTypes: [],
      ownershipProperties: [],
      showSuite: false,
      addressOptions: {},
      open: false,
    }
    this.handleOpen = () => {
      this.setState({ open: true })
    }

    this.handleClose = () => {
      this.setState({ open: false })
    }
    this.getOwnershipTypes()
    this.getOwnershipPersonTypes()
    this.getUnits(global.buildingId)
  }

  getOwnershipTypes() {
    const component = this
    global.internalApi.getOwnershipTypes().then(function (data) {
      const types = _.map(data, (o) => {
        return {
          value: o.id,
          display: o.description,
        }
      })
      component.setState({ ownershipTypes: types })
    })
  }

  getOwnershipPersonTypes() {
    const component = this
    global.internalApi.getOwnershipPersonTypes().then(function (data) {
      const types = _.map(data, (o) => {
        return {
          value: o.id,
          display: o.description,
        }
      })
      component.setState({ ownershipPersonTypes: types })
    })
  }

  getUnits(buildingId) {
    const component = this
    global.internalApi.getBuildingUnits(buildingId).then(function (data) {
      const units = _.map(data, (o) => {
        return {
          id: o.id,
          number: o.commaxId,
        }
      })
      component.setState({ units: units, buildingId: buildingId })
      const options = _.fromPairs(
        _.map(_.sortBy(units, ['number']), (unit) => {
          return [`Suite ${unit.number}`, [unit.number]]
        })
      )
      console.log('options', options)
      component.setState({ addressOptions: options })
    })
  }

  getunitId(number) {
    let o = _.filter(this.state.units, (o) => {
      return o.number === number
    })
    let v = null
    if (o.length > 0) {
      v = o[0].id
    }
    return v
  }

  getunitNumber(id) {
    let o = _.filter(this.state.units, (o) => {
      return o.id === id
    })
    let v = null
    if (o.length > 0) {
      v = o[0].number
    }
    return v
  }

  getOwnershipByNumber(number) {
    const component = this
    const unitId = this.getunitId(number)
    component.setState({
      unitNumber: number,
      unitId: unitId,
    })
    this.getOwnershipById(unitId)
  }

  getOwnershipById(unitId) {
    const component = this
    let ownership = {}
    this.handleClose()
    global.internalApi
      .getOwnershipByUnit(unitId)
      .then(function (data) {
        const people = _.map(data.ownershipPersons, (o) => {
          let fullAddress = o.address
          if (o.suite && o.suite.trim().length > 0) {
            fullAddress += ' Suite ' + o.suite
          }
          if (o.city && o.city.trim().length > 0) {
            fullAddress += ', ' + o.city
          }
          if (o.province && o.province.trim().length > 0) {
            fullAddress += ', ' + o.province
          }
          if (o.postcodeZip && o.postcodeZip.trim().length > 0) {
            fullAddress += ', ' + o.postcodeZip
          }
          if (o.country && o.country.trim().length > 0) {
            fullAddress += ', ' + o.country
          }
          return {
            id: o.id,
            salutation: o.salutation,
            firstName: o.firstName,
            middleName: o.middleName,
            lastName: o.lastName,
            address: o.address,
            suite: o.suite,
            city: o.city,
            province: o.province,
            postcodeZip: o.postcodeZip,
            country: o.country,
            email: o.email,
            homePhone: o.homePhone,
            cellPhone: o.cellPhone,
            workPhone: o.workPhone,
            typeId: o.typeId,
            ownershipId: o.ownership,
            type: o.type.description,
            fullAddress: fullAddress,
          }
        })
        const properties = _.map(data.properties, (o) => {
          return {
            id: o.id,
            ownershipId: data.id,
            legalLevel: o.legalLevel,
            legalUnit: o.legalUnit,
            suite: o.suite,
            design: o.design,
            size: o.size,
            typeId: o.typeId,
            type: o.type.description,
          }
        })
        let activateDate = new Date(data.activateDate)
        let inactivateDate = new Date(data.inActivateDate)
        ownership = {
          id: data.id,
          activateDate: activateDate,
          inactivateDate:
            inactivateDate.getUTCFullYear() <= 1 ? undefined : inactivateDate,
          notes: data.notes ? data.notes : '',
          active: data.active,
          typeId: data.typeId,
          people: people,
          properties: properties,
        }
        let emptyPeople = {
          id: 0,
          salutation: '',
          firstName: '',
          middleName: '',
          lastName: '',
          address: '',
          suite: '',
          city: '',
          province: '',
          postcodeZip: '',
          country: '',
          email: '',
          homePhone: '',
          cellPhone: '',
          workPhone: '',
          typeId: 1,
          ownershipId: ownership.id,
          type: '',
        }
        let emptyproperty = {
          id: 0,
          ownershipId: ownership.id,
        }
        component.setState({
          ownership: ownership,
          emptyPeople: emptyPeople,
          emptyproperty: emptyproperty,
        })
      })
      .then(function () {
        global.internalApi
          .getBuildingOwnershipUnits(component.state.buildingId)
          .then(function (data) {
            const ownershipProperties = _.map(data, (d) => {
              return {
                value: d.id,
                display: d.suite + ' - ' + d.type.description,
              }
            })
            component.setState({
              ownershipProperties: ownershipProperties,
            })
          })
      })
  }

  handleSearchChange(unit) {
    console.log(`loading unit ${unit}`)
    this.getOwnershipByNumber(unit)
    this.setState({ showSuite: true })
  }

  handlePersonSave(entity) {
    const component = this
    if (entity.id > 0) {
      global.internalApi.updateOwnershipPerson(entity).then(function () {
        component.getOwnershipById(component.state.unitId)
      })
    } else {
      global.internalApi.addOwnershipPerson(entity).then(function () {
        component.getOwnershipById(component.state.unitId)
      })
    }
    console.log('Person updated: ', entity)
  }

  handlePersonDelete(entities) {
    const component = this
    _.each(entities, (entity) => {
      global.internalApi.deleteOwnershipPerson(entity.id).then(function () {
        component.getOwnershipById(component.state.unitId)
      })
    })
  }

  handleOwnershipUnitSave(entity) {
    const component = this
    if (entity.id > 0) {
      global.internalApi
        .addOwnershipUnit(entity.id, entity.ownershipId)
        .then(function () {
          component.getOwnershipById(component.state.unitId)
        })
    }
  }

  handleOwnershipUnitDelete(entities) {
    const component = this
    _.each(entities, (entity) => {
      global.internalApi
        .deleteOwnershipUnit(entity.id, entity.ownershipId)
        .then(function () {
          component.getOwnershipById(component.state.unitId)
        })
    })
  }

  handleOwnershipSave() {
    const component = this
    if (this.state.ownership.id > 0) {
      global.internalApi
        .updateOwnership(this.state.ownership)
        .then(function () {
          component.getOwnershipById(component.state.unitId)
        })
    }
  }

  handleTransfer() {
    const component = this
    this.handleClose()
    if (this.state.ownership.id > 0) {
      global.internalApi
        .transferOwnership(this.state.ownership.id)
        .then(function () {
          component.getOwnershipById(component.state.unitId)
        })
    }
  }

  render() {
    const transferActions = [
      <FlatButton
        key="cancel"
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        key="submit"
        label="Submit"
        primary={true}
        disabled={false}
        onClick={this.handleTransfer}
      />,
    ]
    return (
      <div>
        <AutoCompleteSearch
          addressOptions={this.state.addressOptions}
          handleAddressUpdate={this.handleSearchChange}
          hintText="Suite number"
        />
        <div style={{ display: this.state.showSuite ? 'none' : 'block' }}>
          <span
            style={{
              fontSize: '24px',
              color: 'rgba(0,0,0,0.87)',
              lineHeight: '48px',
            }}
          >
            Please select a suite using the search above
          </span>
        </div>
        <div
          style={{
            display: this.state.showSuite ? 'block' : 'none',
            height: '730px',
            overflowY: 'scroll',
            marginTop: '10px',
          }}
        >
          <Dialog
            title="Transfer Ownership"
            actions={transferActions}
            modal={true}
            open={this.state.open}
          >
            This will transfer the current ownership. Continue?
          </Dialog>
          <Grid container>
            <Grid container xs={12}>
              <Grid item xs={5}>
                <Card style={{ textAlign: 'left', margin: '20px' }}>
                  <CardTitle
                    title={'Suite ' + this.state.unitNumber}
                    subtitle="Ownership detail"
                  />
                  <CardText>
                    <Grid container>
                      <Grid container xs={12}>
                        <Grid item xs={6}>
                          <div>
                            <DatePicker
                              floatingLabelText="Activate Date"
                              floatingLabelFixed={true}
                              autoOk={true}
                              firstDayOfWeek={0}
                              formatDate={
                                new global.Intl.DateTimeFormat('en-US', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                }).format
                              }
                              value={this.state.ownership.activateDate}
                              onChange={(event, value) => {
                                let valueObj = {}
                                valueObj['activateDate'] = value
                                this.setState({
                                  ownership: _.assign(
                                    this.state.ownership,
                                    valueObj
                                  ),
                                })
                              }}
                            />
                            <DatePicker
                              floatingLabelText="Inactivate Date"
                              floatingLabelFixed={true}
                              autoOk={true}
                              firstDayOfWeek={0}
                              formatDate={
                                new global.Intl.DateTimeFormat('en-US', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                }).format
                              }
                              value={this.state.ownership.inactivateDate}
                              onChange={(event, value) => {
                                let valueObj = {}
                                valueObj['inactivateDate'] = value
                                this.setState({
                                  ownership: _.assign(
                                    this.state.ownership,
                                    valueObj
                                  ),
                                })
                              }}
                            />
                            <EntityCrudSelectField
                              label="Type"
                              value={this.state.ownership.typeId}
                              optionValues={this.state.ownershipTypes}
                              handleChange={(value) => {
                                let valueObj = {}
                                valueObj['typeId'] = value
                                this.setState({
                                  ownership: _.assign(
                                    this.state.ownership,
                                    valueObj
                                  ),
                                })
                              }}
                            />
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <div>
                            <TextField
                              floatingLabelText="Notes"
                              floatingLabelFixed={true}
                              fullWidth={true}
                              multiLine={true}
                              rows={1}
                              rowsMax={5}
                              value={this.state.ownership.notes}
                              onChange={(event, value) => {
                                let valueObj = {}
                                valueObj['notes'] = value
                                this.setState({
                                  ownership: _.assign(
                                    this.state.ownership,
                                    valueObj
                                  ),
                                })
                              }}
                            />
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardText>
                  <CardActions>
                    <RaisedButton
                      label="Save"
                      primary={true}
                      style={{ marginRight: '2em' }}
                      onClick={this.handleOwnershipSave}
                    />
                    <RaisedButton
                      label="Transfer"
                      primary={false}
                      style={{ marginRight: '2em' }}
                      onClick={this.handleOpen}
                    />
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={7}>
                <EntityCrudSummaryCard
                  searchHintText="Suite number"
                  entityName="Property"
                  entityProperties={[
                    { label: 'suite', name: 'suite' },
                    { label: 'type', name: 'type' },
                    { label: 'legal Level', name: 'legalLevel' },
                    { label: 'legal Unit', name: 'legalUnit' },
                  ]}
                  entitySchema={[
                    {
                      label: 'Property',
                      name: 'id',
                      type: 'options',
                      optionValues: this.state.ownershipProperties,
                    },
                  ]}
                  disableEdit={true}
                  NewEntityLable="Parking\Locker"
                  entities={this.state.ownership.properties}
                  emptyEntity={this.state.emptyproperty}
                  onEntityAdd={this.handleOwnershipUnitSave}
                  onEntitiesDelete={this.handleOwnershipUnitDelete}
                />
              </Grid>
              <Grid item xs={12}>
                <EntityCrudSummaryCard
                  searchHintText="First / last name"
                  entityName="People"
                  entityProperties={[
                    { label: 'Type', name: 'type' },
                    { label: 'first name', name: 'firstName' },
                    { label: 'last name', name: 'lastName' },
                    { label: 'Address', name: 'fullAddress' },
                    { label: 'Email', name: 'email' },
                    { label: 'home Phone', name: 'homePhone' },
                    { label: 'business Phone', name: 'workPhone' },
                    { label: 'Mobile', name: 'cellPhone' },
                  ]}
                  entitySchema={[
                    {
                      label: 'type',
                      name: 'typeId',
                      type: 'options',
                      optionValues: this.state.ownershipPersonTypes,
                    },
                    { label: 'salutation', name: 'salutation', type: 'text' },
                    { label: 'first name', name: 'firstName', type: 'text' },
                    { label: 'middle name', name: 'middleName', type: 'text' },
                    { label: 'last name', name: 'lastName', type: 'text' },
                    { label: 'address', name: 'address', type: 'text' },
                    { label: 'suite', name: 'suite', type: 'text' },
                    { label: 'city', name: 'city', type: 'text' },
                    { label: 'province', name: 'province', type: 'text' },
                    {
                      label: 'PostalCode/Zip',
                      name: 'postalcodeZip',
                      type: 'text',
                    },
                    { label: 'country', name: 'country', type: 'text' },
                    { label: 'email', name: 'email', type: 'text' },
                    { label: 'home Phone', name: 'homePhone', type: 'text' },
                    {
                      label: 'business Phone',
                      name: 'workPhone',
                      type: 'text',
                    },
                    { label: 'Mobile', name: 'cellPhone', type: 'text' },
                  ]}
                  entities={this.state.ownership.people}
                  emptyEntity={this.state.emptyPeople}
                  onEntitySave={this.handlePersonSave}
                  onEntityAdd={this.handlePersonSave}
                  onEntitiesDelete={this.handlePersonDelete}
                />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}
