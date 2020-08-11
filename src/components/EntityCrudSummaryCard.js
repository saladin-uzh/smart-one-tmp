import _ from 'lodash'
import React, { Component } from 'react'

import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'
import { Card, CardActions, CardText } from 'material-ui/Card'

import { EntityCrudEditDialog, SearchAutoSuggest } from '.'

export default class EntityCrudSummaryCard extends Component {
  constructor(props) {
    super(props)
    this.handleEntitySave = this.handleEntitySave.bind(this)
    this.handleEntityAdd = this.handleEntityAdd.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleEntitySelection = this.handleEntitySelection.bind(this)
    this.handleEntitiesDelete = this.handleEntitiesDelete.bind(this)
    this.state = {
      filteredEntities: this.props.entities,
      clickedEntity: {},
      selectedEntities: {},
      emptyEntity: { ...this.props.emptyEntity },
      showEditDialog: false,
      showAddDialog: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ filteredEntities: nextProps.entities })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.filteredEntities !== this.state.filteredEntities) return true
    if (nextState.showEditDialog !== this.state.showEditDialog) return true
    if (nextState.showAddDialog !== this.state.showAddDialog) return true
    return false
  }

  handleEntitySave(entity) {
    var value = this.props.onEntitySave(entity)
    if (!String.isNullOrEmpty(value)) {
      return value
    } else {
      this.setState({ showEditDialog: false })
      return ''
    }
  }

  handleEntityAdd(entity) {
    var value = this.props.onEntityAdd(entity)
    if (!String.isNullOrEmpty(value)) {
      return value
    } else {
      this.setState({ showAddDialog: false })
      return ''
    }
  }

  handleEntitiesDelete() {
    this.props.onEntitiesDelete(this.state.selectedEntities)
  }

  handleSearchChange(searchText) {
    if (_.isEmpty(searchText)) {
      this.setState({ filteredEntities: this.props.entities })
    } else {
      let foundEntities = _.filter(this.props.entities, (ent) => {
        return !_.isUndefined(
          _.find(ent, (value) => {
            return value
              .toString()
              .toLowerCase()
              .includes(searchText.toLowerCase())
          })
        )
      })
      this.setState({ filteredEntities: foundEntities })
    }
  }

  handleEntitySelection(selectedIndices) {
    const selectedEntities = _.map(selectedIndices, (i) => {
      return this.state.filteredEntities[i]
    })

    this.setState({ selectedEntities: selectedEntities })
  }

  render() {
    const component = this
    return (
      <div>
        <Card style={{ textAlign: 'left', margin: '20px' }}>
          <CardText style={{ padding: '0 16px 0 16px' }}>
            <span
              style={{
                fontSize: '24px',
                color: 'rgba(0,0,0,0.87)',
                lineHeight: '36px',
              }}
            >
              {this.props.entityName}
            </span>
            <SearchAutoSuggest
              onSearchChange={this.handleSearchChange}
              hintText={this.props.searchHintText}
              style={{
                display: 'inline-block',
                height: '36px',
                marginLeft: '50px',
              }}
            />
            <div>
              <Table
                height={'150px'}
                selectable={true}
                multiSelectable={true}
                onCellClick={(row, column) => {
                  console.log(`clicked row ${row}, column ${column}`)
                  if (column >= 0) {
                    component.setState({
                      clickedEntity: component.state.filteredEntities[row],
                      showEditDialog: true,
                      showAddDialog: false,
                    })
                  }
                }}
                onRowSelection={(selected) => {
                  console.log('selected rows', selected)
                  let selectedIndices = []

                  if (Array.isArray(selected)) {
                    selectedIndices = selected
                  } else {
                    if (selected === 'all') {
                      selectedIndices = _.range(
                        this.state.filteredEntities.length
                      )
                    }
                    if (selected === 'none') {
                      selectedIndices = []
                    }
                  }

                  this.handleEntitySelection(selectedIndices)
                }}
              >
                <TableHeader>
                  <TableRow>
                    {_.map(this.props.entityProperties, (Property) => {
                      return (
                        <TableHeaderColumn>
                          {_.capitalize(Property.label)}
                        </TableHeaderColumn>
                      )
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody
                  displayRowCheckbox={true}
                  showRowHover={true}
                  deselectOnClickaway={false}
                >
                  {_.map(this.state.filteredEntities, (entity) => {
                    return (
                      <TableRow>
                        {_.map(this.props.entityProperties, (Property) => {
                          return (
                            <TableRowColumn>
                              {entity[Property.name]}
                            </TableRowColumn>
                          )
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardText>
          <CardActions>
            <RaisedButton
              label="New"
              primary={false}
              style={{ marginRight: '2em' }}
              disabled={this.props.disableAdd}
              onClick={() => {
                component.setState({
                  showEditDialog: false,
                  showAddDialog: true,
                })
              }}
            />
            {!this.props.disableDelete ? (
              <FlatButton label="Delete" onClick={this.handleEntitiesDelete} />
            ) : (
              ''
            )}
          </CardActions>
        </Card>
        {this.state.showEditDialog && !this.props.disableEdit ? (
          <EntityCrudEditDialog
            entityName={this.props.entityName}
            title={this.props.EditEntityLable}
            entitySchema={this.props.entitySchema}
            entity={this.state.clickedEntity}
            action="Edit"
            open={true}
            onEntitySave={this.handleEntitySave}
            handleClose={() => {
              this.setState({ showEditDialog: false })
            }}
          />
        ) : (
          ''
        )}
        {this.state.showAddDialog && !this.props.disableAdd ? (
          <EntityCrudEditDialog
            entityName={this.props.entityName}
            title={this.props.NewEntityLable}
            entitySchema={this.props.entitySchema}
            entity={{ ...this.props.emptyEntity }}
            action="New"
            open={true}
            onEntitySave={this.handleEntityAdd}
            handleClose={() => {
              this.setState({ showAddDialog: false })
            }}
          />
        ) : (
          ''
        )}
      </div>
    )
  }
}
