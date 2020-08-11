import _ from 'lodash'
import React, { Component } from 'react'
import {
  Card,

  // CardMedia,
  CardTitle,
  CardText,
} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import AutoComplete from 'material-ui/AutoComplete'
import Grid from 'material-ui-next/Grid'
import Chip from 'material-ui/Chip'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import moment from 'moment'
import {
  AutoCompleteSearch,
  MessageList,
  EntityCrudSummaryCard,
} from '../utils/foundation'

export default class Directory extends Component {
  constructor(props) {
    super(props)
    this.getUnitByNumber = this.getUnitByNumber.bind(this)
    this.getunitId = this.getunitId.bind(this)
    this.handleOccupantSave = this.handleOccupantSave.bind(this)
    this.handleOccupantDelete = this.handleOccupantDelete.bind(this)
    this.handleDirectorySave = this.handleDirectorySave.bind(this)
    this.handleDirectoryAdd = this.handleDirectoryAdd.bind(this)
    this.handleDirectoryDelete = this.handleDirectoryDelete.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.getUnits = this.getUnits.bind(this)
    this.getunitId = this.getunitId.bind(this)
    this.getNotifications = this.getNotifications.bind(this)
    this.getDirectoryEntity = this.getDirectoryEntity.bind(this)
    //this.getTagList = this.getTagList.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this)
    this.handleNewTagValueChange = this.handleNewTagValueChange.bind(this)
    this.handleTagSave = this.handleTagSave.bind(this)
    this.handleRemoveTag = this.handleRemoveTag.bind(this)
    this.handleFilterTag = this.handleFilterTag.bind(this)
    this.handleMessageDelete = this.handleMessageDelete.bind(this)
    this.handleOpenAlert = this.handleOpenAlert.bind(this)
    this.handleCloseAlert = this.handleCloseAlert.bind(this)
    this.isValueName = this.isValueName.bind(this)
    this.formateName = this.formateName.bind(this)
    this.state = {
      unit: {
        id: 1,
        number: '',
        tags: [],

        occupants: [],
        directoryEntries: [],
      },
      emptyOccupant: {},
      emptyDirectory: {},
      units: [],
      showSuite: false,
      showNewTag: false,
      addressOptions: {},
      tagList: [],
      openAlert: false,
      AlertMessage: '',
    }
    this.getUnits(global.buildingId)
  }

  handleOpenAlert(alertMessage) {
    this.setState({ openAlert: true, AlertMessage: alertMessage })
  }

  handleCloseAlert() {
    this.setState({ openAlert: false })
  }

  componentWillReceiveProps() {
    //this.getNotifications();
  }

  getTagList(buildingId) {
    const component = this
    global.internalApi
      .getExistBuildingTags(buildingId)
      .then(function (data) {
        const tags = data
        component.setState({ buildingTagList: tags })
      })
      .then(function () {
        let list = component.state.buildingTagList
        if (component.state.unit) {
          list = component.state.buildingTagList.filter(
            (tag) =>
              !component.state.unit.tags.some(function (val) {
                return val.tag === tag
              })
          )
        }
        component.setState({
          tagList: list,
        })
      })
  }

  getUnits(buildingId) {
    const component = this
    global.internalApi
      .getBuildingUnits(buildingId)
      .then(function (data) {
        const units = _.map(data, (o) => {
          return {
            id: o.id,
            number: o.commaxId,
          }
        })
        component.setState({ units: units })
        const options = _.fromPairs(
          _.map(_.sortBy(units, ['number']), (unit) => {
            return [`Suite ${unit.number}`, [unit.number]]
          })
        )
        console.log('options', options)
        component.setState({ addressOptions: options })
      })
      .then(function () {
        //component.getUnitByNumber(global.firstUnit);
        //component.getNotifications();
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

  getUnitByNumber(number) {
    this.getUnitById(this.getunitId(number))
  }

  getUnitById(unitId) {
    const component = this
    const number = component.getunitNumber(unitId)
    let unit = {}
    let directoryEntries = []
    // let emptyOccupant = {
    //   id: 0,
    //   firstName: '',
    //   lastName: '',
    //   email: '',
    //   phone: '',
    //   unitId: unit.id,
    // }
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
          tags: data.tags,
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

  getNotifications(unitNum) {
    const component = this
    if (unitNum === undefined) unitNum = component.state.unit.number
    global.externalApi
      .getBuildingNotifications(global.buildingNum)
      .then((data) => {
        const notifications = _.map(data, (msg) => {
          //console.log('message', msg)
          const allAddressees = _.uniq(
            _.map(msg.m_house, (addr) => {
              return addr.House.split('-')[1]
            })
          )
          const displayAddressees =
            msg.m_house.length > 4
              ? `${allAddressees[0]}, ${allAddressees[1]}, ${
                  allAddressees[2]
                } and ${allAddressees.length - 3} others`
              : _.sum(
                  _.map(allAddressees, (a) => {
                    return a + ' '
                  })
                )
          var parser = new DOMParser()
          return {
            id: msg.m_no,
            subject: parser.parseFromString(
              '<!doctype html><body>' + msg.m_subject,
              'text/html'
            ).body.textContent,
            type: msg.m_type,
            message: parser.parseFromString(
              '<!doctype html><body>' + msg.m_content,
              'text/html'
            ).body.textContent,
            allSentTo: allAddressees,
            sentTo: displayAddressees,
            sendDate: moment(msg.m_wdate, 'YYYYMMDDHHmm').unix(),
            expires: moment(msg.m_edate, 'YYYYMMDDHHmm').unix(),
          }
        })
        const unitNotifications = _.filter(notifications, (msg) => {
          return msg.allSentTo.includes(unitNum)
        })
        component.setState({ messages: unitNotifications })
      })
    //const component = this;
    //global.externalApi.getNotifications().then((data)=> {
    //  const notifications = _.map(data, (msg) => {
    //    return {
    //      subject: msg.m_subject,
    //      type: msg.m_type,
    //      message: msg.m_content,
    //      sendDate: moment(msg.m_wdate, 'YYYYMMDDHHmm').format('l'),
    //      expires: moment(msg.m_edate, "YYYYMMDDHHmm").unix()
    //    }
    //  });
    //  this.setState({messages: notifications, showNotifications: true});
    //});
  }

  getDirectoryEntity(buildingId, unitId) {
    const component = this
    let directoryEntries = []
    global.externalApi
      .getDirectoryEntry(buildingId, unitId)
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
        let unit = component.state.unit
        unit.directoryEntries = directoryEntries
        component.setState({
          unit: unit,
        })
      })
  }

  handleSearchChange(unit) {
    console.log(`loading unit ${unit}`)
    this.getUnitByNumber(unit)
    this.getNotifications(unit[0])
    this.setState({ showSuite: true })
  }

  handleOccupantSave(entity) {
    const component = this
    if (entity.id > 0) {
      global.internalApi.updateOccupant(entity)
    } else {
      global.internalApi.addOccupant(entity).then(function () {
        component.getUnitById(entity.unitId)
      })
    }
    console.log('occupant updated: ', entity)
  }

  handleOccupantDelete(entities) {
    const component = this
    _.each(entities, (entity) => {
      global.internalApi.deleteOccupants(entity.id).then(function () {
        component.getUnitByNumber(component.state.unit.number)
      })
    })
  }

  formateName(name) {
    return name.trim().replace(/\s\s+/g, ' ')
  }

  isValueName(name) {
    if (name.includes('#')) {
      return {
        valid: false,
        error: 'The # symbol cannot appear in the lobby directory.',
      }
    }
    if (name.length > global.maxNameLength) {
      return {
        valid: false,
        error:
          'The Maximum Length for Name is ' +
          global.maxNameLength +
          ' Characters.',
      }
    }
    let names = name.split(' ')
    let tooLong = names.some(function (val) {
      return val.length > global.maxWordLength
    })
    if (tooLong) {
      return {
        valid: false,
        error:
          'The Maximum Length for a First or Last Name is ' +
          global.maxWordLength +
          ' Characters.',
      }
    }
    return { valid: true, error: '' }
  }

  handleDirectorySave(entity) {
    const component = this
    let buildingId = entity.buildingId
    let unitId = entity.unitId
    entity.name = this.formateName(entity.name)
    var result = this.isValueName(entity.name)
    if (result.valid) {
      let name = JSON.stringify([
        { hu_no: entity.id, username: entity.name },
      ]).replace(/'/g, "''")
      global.externalApi
        .setDirectoryEntry(buildingId, unitId, name)
        .then(function () {
          component.getDirectoryEntity(buildingId, unitId)
        })
    } else {
      component.getDirectoryEntity(buildingId, unitId)
    }
    return result.error
  }

  handleDirectoryAdd(entity) {
    const component = this
    let buildingId = entity.buildingId
    let unitId = entity.unitId
    entity.name = this.formateName(entity.name)
    var result = this.isValueName(entity.name)
    if (result.valid) {
      let name = JSON.stringify([{ username: entity.name }]).replace(/'/g, "''")
      global.externalApi
        .addDirectoryEntry(buildingId, unitId, name)
        .then(function () {
          component.getDirectoryEntity(buildingId, unitId)
        })
    } else {
      component.getDirectoryEntity(buildingId, unitId)
    }
    return result.error
  }

  handleDirectoryDelete(entities) {
    const component = this
    var name = []
    var buildingId = ''
    var unitId = ''
    _.each(entities, (entity) => {
      buildingId = entity.buildingId
      unitId = entity.unitId
      name.push({ hu_no: entity.id })
    })
    let names = JSON.stringify(name).replace(/'/g, "''")
    console.log('deleting ', buildingId, unitId, name)
    global.externalApi
      .deleteDirectoryEntry(buildingId, unitId, names)
      .then(function () {
        component.getDirectoryEntity(buildingId, unitId)
      })
  }

  handleAddTag() {
    const component = this
    global.internalApi
      .getExistBuildingTags(global.buildingId)
      .then(function (data) {
        let tags = data
        if (component.state.unit) {
          tags = data.filter(
            (tag) =>
              !component.state.unit.tags.some(function (val) {
                return val.tag === tag
              })
          )
        }
        component.setState({
          showNewTag: !component.state.showNewTag,
          newTagValue: '',
          tagList: tags,
        })
      })
  }

  handleNewTagValueChange(value) {
    this.setState({ newTagValue: _.capitalize(value) })
  }
  handleFilterTag(searchText, key) {
    return (
      searchText !== '' &&
      key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    )
  }

  handleTagSave() {
    const component = this
    let exist = component.state.unit.tags.some(function (val) {
      return val.tag === component.state.newTagValue
    })
    if (exist) {
      this.handleOpenAlert('The Same Tag Cannot be Added Twice.')
      return
    }
    const newTag = {
      tag: this.state.newTagValue,
      PropertyId: this.state.unit.id,
    }
    global.internalApi.saveTag(newTag).then(function (data) {
      const addedTag = {
        id: data.id,
        tag: data.tag,
        PropertyId: data.PropertyId,
      }
      component.setState({
        unit: _.assign(component.state.unit, {
          tags: component.state.unit.tags.concat(addedTag),
        }),
        showNewTag: false,
      })
    })
  }

  handleRemoveTag(tag) {
    const component = this
    global.internalApi.deleteTag(tag).then(function () {
      component.setState({
        unit: _.assign(component.state.unit, {
          tags: _.without(component.state.unit.tags, tag),
        }),
        showNewTag: false,
      })
    })
  }

  handleMessageDelete(message) {
    global.externalApi.deleteNotification(message.id).then(() => {
      this.getNotifications(this.state.unit.number)
    })
  }

  render() {
    const actions = [
      <FlatButton
        key="ok"
        label="OK"
        primary={true}
        onClick={this.handleCloseAlert}
      />,
    ]
    return (
      <div>
        <AutoCompleteSearch
          addressOptions={
            /*{
          'Suite 101': ['101'],
          'Suite 102': ['102'],
          'Suite 105': ['105']
        }*/
            this.state.addressOptions
          }
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
          <div style={{ marginLeft: '15px', height: '48px' }}>
            <div
              style={{ marginLeft: '15px', display: 'flex', flexWrap: 'wrap' }}
            >
              {_.map(this.state.unit.tags, (tag) => {
                return (
                  <Chip
                    onRequestDelete={() => {
                      this.handleRemoveTag(tag)
                    }}
                    style={{ margin: 4 }}
                  >
                    {' '}
                    {tag.tag}{' '}
                  </Chip>
                )
              })}
              <IconButton
                iconStyle={{ width: 24, height: 24 }}
                style={{
                  width: 36,
                  height: 36,
                  position: 'relative',
                  top: '-5px',
                }}
                onClick={this.handleAddTag}
              >
                <ContentAdd />
              </IconButton>
              <div
                style={{ display: this.state.showNewTag ? 'block' : 'none' }}
              >
                <AutoComplete
                  style={{ height: '36px', marginLeft: '10px' }}
                  listStyle={{ maxHeight: 200, overflow: 'auto' }}
                  hintText="Tag"
                  searchText={this.state.newTagValue}
                  dataSource={this.state.tagList}
                  onUpdateInput={(searchText /**, dataSource, params*/) => {
                    this.handleNewTagValueChange(searchText)
                  }}
                  filter={this.handleFilterTag}
                />

                <FlatButton
                  label="Save"
                  primary={true}
                  style={{ marginLeft: '10px' }}
                  onClick={() => {
                    this.handleTagSave()
                  }}
                ></FlatButton>
              </div>
            </div>
            <span
              style={{
                fontSize: '36px',
                color: 'rgba(0,0,0,0.87)',
                lineHeight: '48px',
                position: 'relative',
                top: '-48px',
              }}
            >
              Suite {this.state.unit.number}{' '}
            </span>
          </div>

          <Grid container>
            <Grid container xs={5}>
              <Grid item xs={12}>
                <EntityCrudSummaryCard
                  searchHintText="First / last name"
                  entityName="Occupants"
                  entityProperties={[
                    { label: 'first name', name: 'firstName' },
                    { label: 'last name', name: 'lastName' },
                    { label: 'phone', name: 'phone' },
                  ]}
                  entitySchema={[
                    { label: 'first name', name: 'firstName', type: 'text' },
                    { label: 'last name', name: 'lastName', type: 'text' },
                    { label: 'phone', name: 'phone', type: 'text' },
                    { label: 'email', name: 'email', type: 'text' },
                  ]}
                  entities={this.state.unit.occupants}
                  emptyEntity={this.state.emptyOccupant}
                  onEntitySave={this.handleOccupantSave}
                  onEntityAdd={this.handleOccupantSave}
                  onEntitiesDelete={this.handleOccupantDelete}
                />
              </Grid>
              <Grid item xs={12}>
                <EntityCrudSummaryCard
                  searchHintText="Name"
                  entityName="Directory Entries"
                  entityProperties={[{ label: 'name', name: 'name' }]}
                  entitySchema={[{ label: 'name', name: 'name', type: 'text' }]}
                  entities={this.state.unit.directoryEntries}
                  emptyEntity={this.state.emptyDirectory}
                  onEntitySave={this.handleDirectorySave}
                  onEntityAdd={this.handleDirectoryAdd}
                  onEntitiesDelete={this.handleDirectoryDelete}
                  disableAdd={
                    this.state.unit.directoryEntries.length >=
                    global.maxLobbyEntries
                  }
                />
              </Grid>
            </Grid>
            <Grid container xs={7}>
              <Grid item xs={12}>
                <Card style={{ textAlign: 'left', margin: '20px' }}>
                  <CardTitle title="Notifications" />
                  <CardText>
                    <MessageList
                      onDelete={this.handleMessageDelete}
                      unitId={this.state.unit.id}
                      messages={this.state.messages}
                      style={{ height: '400px' }}
                    />
                  </CardText>
                </Card>
              </Grid>
            </Grid>
            <Dialog
              actions={actions}
              modal={true}
              open={this.state.openAlert}
              onRequestClose={this.handleCloseAlert}
            >
              {this.state.AlertMessage}
            </Dialog>
          </Grid>
        </div>
      </div>
    )
  }
}
