import _ from "lodash"
import React, { memo, useState, useEffect } from "react"

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
} from "@material-ui/core"

import { EntityCrudEditDialog, SearchAutoSuggest } from "."

export default memo(
  ({
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
    disableEdit,
    EditEntityLable,
    entitySchema,
    NewEntityLable,
  }) => {
    const [filteredEntities, setFilteredEntities] = useState(entities)
    const [clickedEntity, setClickedEntity] = useState({})
    const [selectedEntities, setSelectedEntities] = useState({})
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showAddDialog, setShowAddDialog] = useState(false)

    useEffect(() => {
      setFilteredEntities(entities)
    }, [entities])

    const handleEntitySave = (entity) => {
      var value = onEntitySave(entity)

      if (!String.isNullOrEmpty(value)) return value

      setShowEditDialog(false)
      return ""
    }

    const handleEntityAdd = (entity) => {
      var value = onEntityAdd(entity)

      if (!String.isNullOrEmpty(value)) return value

      setShowAddDialog(false)
      return ""
    }

    const handleEntitiesDelete = () => onEntitiesDelete(selectedEntities)

    const handleSearchChange = (searchText) => {
      if (_.isEmpty(searchText)) setFilteredEntities(entities)
      else {
        const foundEntities = _.filter(
          entities,
          (ent) =>
            !_.isUndefined(
              _.find(ent, (value) =>
                value
                  .toString()
                  .toLowerCase()
                  .includes(searchText.toLowerCase())
              )
            )
        )

        setFilteredEntities(foundEntities)
      }
    }

    const handleEntitySelection = (selectedIndices) => {
      const newSelectedEntities = _.map(
        selectedIndices,
        (i) => filteredEntities[i]
      )

      setSelectedEntities(newSelectedEntities)
    }

    const handleCellCLick = (row, column) => {
      console.log(`clicked row ${row}, column ${column}`)

      if (column >= 0) {
        setClickedEntity(filteredEntities[row])
        setShowEditDialog(true)
        setShowAddDialog(false)
      }
    }

    const handleRowClick = (selected) => {
      console.log("selected rows", selected)

      let selectedIndices = []

      if (Array.isArray(selected)) selectedIndices = selected
      else {
        if (selected === "all") {
          selectedIndices = _.range(filteredEntities.length)
        }
        if (selected === "none") {
          selectedIndices = []
        }
      }

      handleEntitySelection(selectedIndices)
    }

    const handleAddClick = () => {
      setShowEditDialog(false)
      setShowAddDialog(true)
    }

    const onEditDialogClose = () => setShowEditDialog(false)

    const onAddDialogClose = () => setShowAddDialog(false)

    return (
      <div>
        <Card style={{ textAlign: "left", margin: "20px" }}>
          <CardContent style={{ padding: "0 16px 0 16px" }}>
            <span
              style={{
                fontSize: "24px",
                color: "rgba(0,0,0,0.87)",
                lineHeight: "36px",
              }}
            >
              {entityName}
            </span>
            <SearchAutoSuggest
              onSearchChange={handleSearchChange}
              hintText={searchHintText}
              style={{
                display: "inline-block",
                height: "36px",
                marginLeft: "50px",
              }}
            />
            <div>
              <Table
                height={"150px"}
                selectable={true}
                multiSelectable={true}
                onCellClick={handleCellCLick}
                onRowSelection={handleRowClick}
              >
                <TableHead>
                  <TableRow>
                    {_.map(entityProperties, ({ label }) => (
                      <TableCell>{_.capitalize(label)}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody
                  displayRowCheckbox={true}
                  showRowHover={true}
                  deselectOnClickaway={false}
                >
                  {_.map(filteredEntities, (entity) => (
                    <TableRow>
                      {_.map(entityProperties, ({ name }) => (
                        <TableCell>{entity[name]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              label="New"
              primary={false}
              style={{ marginRight: "2em" }}
              disabled={disableAdd}
              onClick={handleAddClick}
            />
            {!disableDelete && (
              <Button label="Delete" onClick={handleEntitiesDelete} />
            )}
          </CardActions>
        </Card>
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
      </div>
    )
  },
  (prev, next) =>
    next.filteredEntities === prev.filteredEntities &&
    next.showEditDialog === prev.showEditDialog &&
    next.showAddDialog === prev.showAddDialog
)
