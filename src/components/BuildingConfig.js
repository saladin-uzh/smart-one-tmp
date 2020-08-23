import _ from "lodash"
import React, { useState, useEffect } from "react"

import { Grid, makeStyles } from "@material-ui/core"

import { EntityCrudSummaryCard } from "."
import { HomeRounded } from "@material-ui/icons"
import { IconDirectories, PageContainer } from "../ui"
import withErrorHandling from "../utils/withErrorHandling"
import { spacings } from "../constants"

const useStyles = makeStyles({
  fullHeight: {
    height: "100%",

    "& .MuiPaper-root.MuiCard-root": {
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      paddingBottom: 0,
      marginBottom: spacings.medium,
    },

    "& .MuiCardContent-root": {
      flexGrow: 1,
    },

    "& .MuiCardActions-root": {
      paddingBottom: spacings.large,
    },
  },
})

export default withErrorHandling(({ handleError }) => {
  const [units, setUnits] = useState([])
  const [occupants, setOccupants] = useState([])
  const [directoryEntries, setDirectoryEntries] = useState([])
  const classes = useStyles()

  const emptyOccupant = {
    id: 0,
    number: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    unitId: "",
  }

  const emptyDirectory = {
    id: 0,
    name: "",
    buildingId: global.buildingNum,
    unitId: "",
  }

  const getUnits = (buildingId) =>
    global.internalApi.getBuildingUnits(buildingId).then((data) => {
      const newUnits = _.map(data, ({ id, commaxId: number }) => ({
        id,
        number: number.replace("\r", ""),
      }))

      setUnits(newUnits)
    })

  const getunitId = (unitNumber) =>
    units.find(({ number }) => number === unitNumber).id

  const getOccupants = (buildingId) =>
    global.internalApi.getOccupants(buildingId).then((data) => {
      const occupants = _.map(
        data,
        ({
          id,
          unitNumber: number,
          firstName,
          lastName,
          email,
          phone,
          propertyId: unitId,
        }) => ({
          id,
          number,
          firstName,
          lastName,
          email,
          phone,
          unitId,
        })
      )

      setOccupants(occupants)
    })

  const handleOccupantSave = (entity) => {
    //NB: the EntityCrudSummaryCard will display the changes to the entity immediately,
    //regardless of what happens here
    console.log(entity)
    entity.unitId = getunitId(entity.number)

    if (entity.id > 0) global.internalApi.updateOccupant(entity)
    else {
      global.internalApi.addOccupant(entity).then(() => {
        getOccupants(global.buildingId)
      })
    }

    console.log("occupant updated: ", entity)
  }

  const handleOccupantDelete = (selection) =>
    Boolean(selection.length)
      ? selection.forEach((occId) => {
          global.internalApi.deleteOccupants(occId).then(() => {
            getOccupants(global.buildingId)
          })
        })
      : handleError("Nothing selected!")

  const getDirectoryEntity = () => {
    const newDirectoryEntries = []

    global.externalApi.getAllDirectoryEntry().then((data) => {
      _.map(data, ({ nickname, building: buildingId, household: number }) => {
        _.map(nickname, ({ hu_no: id, username: name }) => {
          newDirectoryEntries.push({
            id,
            name: Boolean(name) ? name : "<empty_name>",
            buildingId,
            number,
          })
        })
      })

      setDirectoryEntries(newDirectoryEntries)
    })
  }

  const handleDirectorySave = ({
    buildingId,
    number: unitId,
    id: hu_no,
    name: username,
  }) => {
    const name = JSON.stringify([{ hu_no, username }]).replace(/'/g, "''")

    global.externalApi.setDirectoryEntry(buildingId, unitId, name).then(() => {
      getDirectoryEntity()
    })
  }

  const handleDirectoryAdd = ({
    buildingId,
    number: unitId,
    name: username,
  }) => {
    const name = JSON.stringify([{ username }]).replace(/'/g, "''")

    global.externalApi.addDirectoryEntry(buildingId, unitId, name).then(() => {
      getDirectoryEntity()
    })
  }

  const handleDirectoryDelete = (selection) =>
    Boolean(selection.length)
      ? selection.forEach((dirId) => {
          const {
            buildingId,
            number,
            id: hu_no,
            name: username,
          } = directoryEntries.find(({ id }) => id === dirId)

          const dirName = JSON.stringify([{ hu_no, username }]).replace(
            /'/g,
            '"'
          )

          global.externalApi
            .deleteDirectoryEntry(buildingId, number, dirName)
            .then(
              () => {
                getDirectoryEntity(buildingId, number)
              },
              ({ message }) => handleError(message)
            )
        })
      : handleError("Nothing selected!")

  useEffect(() => {
    getUnits(global.buildingId)
    getOccupants(global.buildingId)
    getDirectoryEntity()
  }, [])

  return (
    <PageContainer>
      <Grid item xs={6} className={classes.fullHeight}>
        <EntityCrudSummaryCard
          searchHintText="Suite number, first / last name"
          searchType="occupants"
          entityName="Suite Occupants"
          NewEntityLable="New Occupant"
          icon={HomeRounded}
          entityProperties={[
            { label: "number", name: "number" },
            { label: "first name", name: "firstName" },
            { label: "last name", name: "lastName" },
          ]}
          entitySchema={[
            {
              label: "Suite number",
              name: "number",
              type: "address",
              optionValues: _.sortBy(units, ["number"]).map(
                ({ number }) => number
              ),
            },
            { label: "first name", name: "firstName", type: "text" },
            { label: "last name", name: "lastName", type: "text" },
            { label: "phone", name: "phone", type: "text" },
            { label: "email", name: "email", type: "text" },
          ]}
          entities={occupants.sort((obj1, obj2) => obj1.number - obj2.number)}
          emptyEntity={emptyOccupant}
          onEntitySave={handleOccupantSave}
          onEntityAdd={handleOccupantSave}
          onEntitiesDelete={handleOccupantDelete}
          handleError={handleError}
        />
      </Grid>
      <Grid item xs={6} className={classes.fullHeight}>
        <EntityCrudSummaryCard
          searchHintText="Suite number, name"
          searchType="dir"
          entityName="Directory Entries"
          NewEntityLable="Add Directory"
          icon={IconDirectories}
          entityProperties={[
            { label: "Number", name: "number" },
            { label: "Name", name: "name" },
          ]}
          entitySchema={[
            {
              label: "Suite number",
              name: "number",
              type: "address",
              optionValues: _.sortBy(units, ["number"]).map(
                ({ number }) => number
              ),
            },
            { label: "name", name: "name", type: "text" },
          ]}
          entities={_.sortBy(directoryEntries, ["number"])}
          emptyEntity={emptyDirectory}
          onEntitySave={handleDirectorySave}
          onEntityAdd={handleDirectoryAdd}
          onEntitiesDelete={handleDirectoryDelete}
          handleError={handleError}
        />
      </Grid>
    </PageContainer>
  )
})
