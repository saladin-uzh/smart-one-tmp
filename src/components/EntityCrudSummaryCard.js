import _ from "lodash"
import React, { useState, useEffect, Fragment } from "react"

import {
  Card,
  CardActions,
  CardContent,
  Button,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Grid,
  CardHeader,
  TableContainer,
  Checkbox,
} from "@material-ui/core"

import { EntityCrudEditDialog, SearchAutoSuggest } from "."
import { colors, spacings, radii } from "../constants"

export default ({
  entities,
  emptyEntity,
  onEntitySave,
  onEntityAdd,
  onEntitiesDelete,
  entityName,
  searchHintText,
  entityProperties,
  disableAdd,
  disableDelete,
  // disableEdit,
  // EditEntityLable,
  entitySchema,
  NewEntityLable,
  icon: Icon,
}) => {
  const [filteredEntities, setFilteredEntities] = useState([])
  const [clickedEntity, setClickedEntity] = useState({})
  const [selectedEntities, setSelectedEntities] = useState([])
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [isSomeSelected, setIsSomeSelected] = useState(false)

  useEffect(() => {
    setFilteredEntities(entities)
  }, [entities])

  useEffect(() => {
    const numSelected = selectedEntities.length

    if (numSelected) {
      if (numSelected === entities.length) {
        setIsAllSelected(true)
        setIsSomeSelected(false)
      } else {
        setIsSomeSelected(true)
        setIsAllSelected(false)
      }
    } else {
      setIsSomeSelected(false)
      setIsAllSelected(false)
    }
  }, [selectedEntities])

  // const handleEntitySave = (entity) => {
  //   var value = onEntitySave(entity)

  //   if (!String.isNullOrEmpty(value)) return value

  //   setShowEditDialog(false)
  //   return ""
  // }

  const handleEntityAdd = (entity) => onEntityAdd(entity)

  // if (!String.isNullOrEmpty(value)) return value

  // setShowAddDialog(false)
  // return ""
  // }

  const handleEntitiesDelete = () => onEntitiesDelete(selectedEntities)

  const handleSearchChange = (selectedId) => {
    if (selectedId)
      setFilteredEntities(entities.filter((ent) => ent.id === selectedId))
    else setFilteredEntities(entities)
  }

  const handleRowClick = (event, entityId) => {
    if (selectedEntities.includes(entityId))
      setSelectedEntities(_.without(selectedEntities, entityId))
    else setSelectedEntities([...selectedEntities, entityId])
  }

  const handleSelectAll = (event) => {
    if (!event.target.checked) setSelectedEntities([])
    else setSelectedEntities(filteredEntities.map((e) => e.id))
  }

  const isSelected = (id) => selectedEntities.includes(id)

  const handleNewButtonClick = () => setShowAddDialog(true)

  // const onEditDialogClose = () => setShowEditDialog(false)

  const onAddDialogClose = () => setShowAddDialog(false)

  return (
    <Fragment>
      <Card>
        <CardHeader
          title={
            <h3 style={{ margin: 0 }}>
              <Icon style={{ marginRight: spacings.xSmall }} />
              {entityName}
            </h3>
          }
          action={
            <SearchAutoSuggest
              type="summary"
              onSearchChange={handleSearchChange}
              options={entities}
              label={searchHintText}
            />
          }
        />

        <CardContent style={{ padding: `0 ${spacings.small}` }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={isSomeSelected}
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      color="primary"
                    />
                  </TableCell>
                  {_.map(entityProperties, ({ label }) => (
                    <TableCell key={`OhxmXUPOT${label}`} align="center">
                      {_.capitalize(label)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {_.map(filteredEntities, (entity) => {
                  const isItemSelected = isSelected(entity.id)

                  return (
                    <TableRow
                      key={`lWAstsZ-E${entity.id}`}
                      onClick={(e) => handleRowClick(e, entity.id)}
                      role="checkbox"
                      selected={isItemSelected}
                      tabIndex={-1}
                    >
                      <TableCell
                        key={`c5hoXOC_X${entity.id}`}
                        padding="checkbox"
                      >
                        <Checkbox checked={isItemSelected} />
                      </TableCell>
                      {_.map(entityProperties, ({ name }) => (
                        <TableCell align="center" key={`${name}n2JSnVN5t`}>
                          {entity[name]}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>

        <CardActions style={{ justifyContent: "flex-end" }}>
          {!disableDelete && (
            <Button
              label="Delete"
              color="default"
              onClick={handleEntitiesDelete}
              style={{ color: colors.text, borderRadius: radii.borderSharp }}
            >
              Delete
            </Button>
          )}
          <Button
            label="New"
            disabled={disableAdd}
            onClick={handleNewButtonClick}
            style={{ borderRadius: radii.borderSharp }}
          >
            New
          </Button>
        </CardActions>
      </Card>

      {/* <Grid item>
        {showEditDialog && !disableEdit && (
          <EntityCrudEditDialog
            entityName={entityName}
            title={EditEntityLable}
            entitySchema={entitySchema}
            entity={clickedEntity}
            action="Edit"
            open={true}
            onEntitySave={handleEntitySave}
            handleClose={onEditDialogClose}
          />
        )}
      </Grid> */}
      <Grid item>
        {showAddDialog && !disableAdd && (
          <EntityCrudEditDialog
            entityName={entityName}
            title={NewEntityLable}
            entitySchema={entitySchema}
            entity={emptyEntity}
            action="New"
            open={true}
            onEntitySave={handleEntityAdd}
            handleClose={onAddDialogClose}
          />
        )}
      </Grid>
    </Fragment>
  )
}
