import _ from "lodash"
import React, { useState, useEffect, Fragment } from "react"

import {
  Card,
  CardActions,
  CardContent,
  Button,
  Grid,
  CardHeader,
  Checkbox,
} from "@material-ui/core"

import { EntityCrudEditDialog, SearchAutoSuggest } from "."
import { colors, radii } from "../constants"
import { CardTilte, PaginatedColumn, VirtualizedTable } from "../ui"

export default ({
  entities,
  emptyEntity,
  // onEntitySave,
  onEntityAdd,
  onEntitiesDelete,
  entityName,
  searchHintText,
  entityProperties,
  disableAdd,
  disableDelete,
  disableEdit,
  // EditEntityLable,
  entitySchema,
  NewEntityLable,
  icon: Icon,
  searchType,
  handleError,
}) => {
  const [filteredEntities, setFilteredEntities] = useState([])
  // const [clickedEntity, setClickedEntity] = useState({})
  const [selectedEntities, setSelectedEntities] = useState([])
  // const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [isSomeSelected, setIsSomeSelected] = useState(false)
  const [currentTablePage, setCurrentTablePage] = useState("")

  useEffect(() => {
    setFilteredEntities(entities)
    setSelectedEntities([])
  }, [entities])

  useEffect(() => {
    const numSelected = selectedEntities.length

    if (numSelected) {
      if (numSelected === filteredEntities.length) {
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
  }, [selectedEntities, filteredEntities])

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

  const handleRowClick = (entityId) => {
    if (selectedEntities.includes(entityId))
      setSelectedEntities((selectedEntities) =>
        _.without(selectedEntities, entityId)
      )
    else
      setSelectedEntities((selectedEntities) => [...selectedEntities, entityId])
  }

  const handleSelectAll = (event) => {
    if (!event.target.checked) setSelectedEntities([])
    else setSelectedEntities(filteredEntities.map((e) => e.id))
  }

  const isSelected = (id) => selectedEntities.includes(id)

  const handleNewButtonClick = () => setShowAddDialog(true)

  // const onEditDialogClose = () => setShowEditDialog(false)

  const onAddDialogClose = () => setShowAddDialog(false)

  const handleTablePageChange = (targetTablePageLabel) => {
    const targetPageIndex = entityProperties.findIndex(
      ({ label }) => label === targetTablePageLabel
    )
    const targetTablePageName = entityProperties[targetPageIndex].name
    setCurrentTablePage(targetTablePageName)
  }

  return (
    <Fragment>
      <Card>
        <CardHeader
          title={<CardTilte icon={Icon} text={entityName} />}
          action={
            <SearchAutoSuggest
              type={searchType}
              onSearchChange={handleSearchChange}
              options={entities}
              label={searchHintText}
            />
          }
        />

        <CardContent>
          <VirtualizedTable
            onRowClick={handleRowClick}
            columns={[
              {
                label: (
                  <Checkbox
                    indeterminate={isSomeSelected}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    color="primary"
                  />
                ),
                dataKey: "selectAll",
              },
              ...(entityProperties.length <= 5
                ? _.map(entityProperties, ({ label, name }) => ({
                    label: _.capitalize(label),
                    dataKey: name,
                  }))
                : [
                    ...entityProperties.slice(0, 4).map(({ label, name }) => ({
                      label: _.capitalize(label),
                      dataKey: name,
                    })),
                    {
                      label: (
                        <PaginatedColumn
                          entities={entityProperties
                            .slice(4)
                            .map(({ label }) => label)}
                          onChange={handleTablePageChange}
                        />
                      ),
                      dataKey: currentTablePage,
                    },
                  ]),
            ]}
            rows={_.map(filteredEntities, (entity) => {
              const isItemSelected = isSelected(entity.id)

              const cells =
                entityProperties.length <= 5
                  ? _.fromPairs(
                      _.map(entityProperties, ({ name }) => [
                        name,
                        entity[name],
                      ])
                    )
                  : {
                      ..._.fromPairs(
                        entityProperties
                          .slice(0, 4)
                          .map(({ name }) => [name, entity[name]])
                      ),
                      [currentTablePage]: entity[currentTablePage],
                    }

              return {
                id: entity.id,
                isItemSelected,
                selectAll: <Checkbox checked={isItemSelected} />,
                ...cells,
              }
            })}
          />
          {/* 
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
                  {entityProperties.length <= 5 ? (
                    _.map(entityProperties, ({ label }) => (
                      <TableCell
                        key={`OhxmXUPOT${label}`}
                        align="center"
                        style={{ fontSize: 16 }}
                      >
                        {_.capitalize(label)}
                      </TableCell>
                    ))
                  ) : (
                    <Fragment>
                      {entityProperties.slice(0, 4).map(({ label }) => (
                        <TableCell
                          key={`nQxpFypoG${label}`}
                          align="left"
                          style={{ fontSize: 16 }}
                        >
                          {_.capitalize(label)}
                        </TableCell>
                      ))}
                      <PaginatedColumn
                        entities={entityProperties
                          .slice(4)
                          .map(({ label }) => label)}
                        onChange={handleTablePageChange}
                      />
                    </Fragment>
                  )}
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
                      {entityProperties.length <= 5 ? (
                        _.map(entityProperties, ({ name }) => (
                          <TableCell align="center" key={`${name}n2JSnVN5t`}>
                            {entity[name]}
                          </TableCell>
                        ))
                      ) : (
                        <Fragment>
                          {entityProperties.slice(0, 4).map(({ name }) => (
                            <TableCell key={`n2JSnVN5t${name}`} align="left">
                              {entity[name]}
                            </TableCell>
                          ))}
                          <TableCell
                            key={`omTHBCqbW${currentTablePage}`}
                            align="left"
                          >
                            {entity[currentTablePage]}
                          </TableCell>
                        </Fragment>
                      )}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer> */}
        </CardContent>

        <CardActions>
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
            handleError={handleError}
          />
        )}
      </Grid>
    </Fragment>
  )
}
