import _ from 'lodash'
import React, { Component } from 'react'

import { Grid } from '@material-ui/core'

import { EntityCrudSummaryCard } from '.'

export default class CommunityConfiguration extends Component {
  constructor(props) {
    super(props)
    this.handleOccupantSave = this.handleOccupantSave.bind(this)
    this.handleOccupantDelete = this.handleOccupantDelete.bind(this)
    this.handleDirectorySave = this.handleDirectorySave.bind(this)
    this.handleDirectoryAdd = this.handleDirectoryAdd.bind(this)
    this.handleDirectoryDelete = this.handleDirectoryDelete.bind(this)
    this.getOccupants = this.getOccupants.bind(this)
    this.getDirectoryEntity = this.getDirectoryEntity.bind(this)
    this.getUnits = this.getUnits.bind(this)
    this.getunitId = this.getunitId.bind(this)
    this.getUnitById = this.getUnitById.bind(this)
    this.state = {
      buildingId: global.buildingId,
      units: [],
      occupants: [],
      directoryEntries: [],
      emptyOccupant: {
        id: 0,
        number: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        unitId: '',
      },
      emptyDirectory: {
        id: 0,
        name: '',
        buildingId: global.buildingNum,
        unitId: '',
      },
    }
    this.getUnits(global.buildingId)
    this.getOccupants(global.buildingId)
    this.getDirectoryEntity()
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
      component.setState({ units: units })
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

  getUnitById(unitId) {
    const component = this
    const number = component.getunitNumber(unitId)
    let unit = {}
    let directoryEntries = []
    global.internalApi
      .getUnit(unitId)
      .then(function (data) {
        const occs = _.map(data.properyOccupants, (o) => {
          return {
            id: o.id,
            firstName: o.firstName,
            lastName: o.lastName,
            email: o.email,
            phone: o.phone,
            unitId: o.propertyId,
          }
        })
        unit = {
          id: data.id,
          number: data.suite,
          tags: [
            'Floor: ' + data.legalLevel,
            'Riser: ' + data.legalUnit,
            'Exposure: East',
          ],
          occupants: occs,
          directoryEntries: [],
        }
      })
      .then(function () {
        global.externalApi
          .getDirectoryEntry(global.buildingNum, number)
          .then(function (data) {
            _.map(data, (d) => {
              _.map(d.nickname, (o) => {
                directoryEntries.push({
                  id: o.hu_no,
                  name: o.username,
                  buildingId: d.building,
                  unitId: d.household,
                })
              })
            })
            unit.directoryEntries = directoryEntries
            component.setState({
              unit: unit,
              emptyOccupant: {
                id: 0,
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                unitId: unit.id,
              },
              emptyDirectory: {
                id: 0,
                name: '',
                buildingId: global.buildingNum,
                unitId: number,
              },
            })
          })
      })
  }

  getOccupants(buildingId) {
    const component = this
    global.internalApi.getOccupants(buildingId).then(function (data) {
      const occupants = _.map(data, (occ) => {
        return {
          id: occ.id,
          number: occ.unitNumber,
          firstName: occ.firstName,
          lastName: occ.lastName,
          email: occ.email,
          phone: occ.phone,
          unitId: occ.propertyId,
        }
      })
      component.setState({ occupants: occupants })
    })
  }

  handleOccupantSave(entity) {
    //NB: the EntityCrudSummaryCard will display the changes to the entity immediately,
    //regardless of what happens here
    const component = this
    entity.unitId = this.getunitId(entity.number)
    if (entity.id > 0) {
      global.internalApi.updateOccupant(entity)
    } else {
      global.internalApi.addOccupant(entity).then(function () {
        component.getOccupants(component.state.buildingId)
      })
    }
    console.log('occupant updated: ', entity)
  }

  handleOccupantDelete(entities) {
    const component = this
    _.each(entities, (entity) => {
      global.internalApi.deleteOccupants(entity.id).then(function () {
        component.getUnitById(entity.unitId)
      })
    })
  }

  getDirectoryEntity() {
    const component = this
    let directoryEntries = []
    global.externalApi.getAllDirectoryEntry().then(function (data) {
      _.map(data, (d) => {
        _.map(d.nickname, (o) => {
          directoryEntries.push({
            id: o.hu_no,
            name: o.username,
            buildingId: d.building,
            number: d.household,
          })
        })
      })
      component.setState({
        directoryEntries: directoryEntries,
      })
    })
  }

  handleDirectorySave(entity) {
    const component = this
    let buildingId = entity.buildingId
    let unitId = entity.number
    let name = JSON.stringify([
      { hu_no: entity.id, username: entity.name },
    ]).replace(/'/g, "''")
    global.externalApi
      .setDirectoryEntry(buildingId, unitId, name)
      .then(function () {
        component.getDirectoryEntity()
      })
  }

  handleDirectoryAdd(entity) {
    const component = this
    let buildingId = entity.buildingId
    let unitId = entity.number
    let name = JSON.stringify([{ username: entity.name }]).replace(/'/g, "''")
    global.externalApi
      .addDirectoryEntry(buildingId, unitId, name)
      .then(function () {
        component.getDirectoryEntity()
      })
  }

  handleDirectoryDelete(entities) {
    const component = this
    _.each(entities, (entity) => {
      let buildingId = entity.buildingId
      let unitId = entity.number
      let name = JSON.stringify([{ hu_no: entity.id }]).replace(/'/g, "''")
      console.log('deleting ', buildingId, unitId, name)
      global.externalApi
        .deleteDirectoryEntry(buildingId, unitId, name)
        .then(function () {
          component.getDirectoryEntity()
        })
    })
  }

  render() {
    return (
      <Grid container>
        <Grid item xs={6}>
          <EntityCrudSummaryCard
            searchHintText="Suite number, first / last name"
            entityName="Suite Occupants"
            entityProperties={[
              { label: 'number', name: 'number' },
              { label: 'first name', name: 'firstName' },
              { label: 'last name', name: 'lastName' },
            ]}
            entitySchema={[
              { label: 'Suite number', name: 'number', type: 'text' },
              { label: 'first name', name: 'firstName', type: 'text' },
              { label: 'last name', name: 'lastName', type: 'text' },
              { label: 'phone', name: 'phone', type: 'text' },
              { label: 'email', name: 'email', type: 'text' },
            ]}
            entities={this.state.occupants.sort(
              (obj1, obj2) => obj1.number - obj2.number
            )}
            emptyEntity={this.state.emptyOccupant}
            onEntitySave={this.handleOccupantSave}
            onEntityAdd={this.handleOccupantSave}
            onEntitiesDelete={this.handleOccupantDelete}
          />
        </Grid>
        <Grid item xs={6}>
          <EntityCrudSummaryCard
            searchHintText="Suite number, name"
            entityName="Directory Entries"
            entityProperties={[
              { label: 'Number', name: 'number' },
              { label: 'Name', name: 'name' },
            ]}
            entitySchema={[
              { label: 'suite number', name: 'number', type: 'text' },
              { label: 'name', name: 'name', type: 'text' },
            ]}
            entities={this.state.directoryEntries}
            emptyEntity={this.state.emptyDirectory}
            onEntitySave={this.handleDirectorySave}
            onEntityAdd={this.handleDirectoryAdd}
            onEntitiesDelete={this.handleDirectoryDelete}
          />
        </Grid>
      </Grid>
    )
  }
}
