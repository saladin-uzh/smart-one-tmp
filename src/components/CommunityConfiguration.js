import _ from "lodash"
import React, { useState, useEffect } from "react"

import { Grid } from "@material-ui/core"

import { EntityCrudSummaryCard } from "."

export default () => {
  const [units, setUnits] = useState([])
  const [occupants, setOccupants] = useState([])
  const [directoryEntries, setDirectoryEntries] = useState([])
  const [emptyOccupant, setEmptyOccupant] = useState({
    id: 0,
    number: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    unitId: "",
  })
  const [emptyDirectory, setEmptyDirectory] = useState({
    id: 0,
    name: "",
    buildingId: global.buildingNum,
    unitId: "",
  })

  const getUnits = (buildingId) =>
    global.internalApi.getBuildingUnits(buildingId).then((data) => {
      const newUnits = _.map(data, ({ id, commaxId: number }) => ({
        id,
        number,
      }))

      setUnits(newUnits)
    })

  const getunitId = (number) => {
    const o = _.filter(units, (o) => o.number === number)

    return o.length > 0 ? o[0].id : null
  }

  const getunitNumber = (unitId) => {
    const o = _.filter(units, (o) => o.id === unitId)

    return o.length > 0 ? o[0].number : null
  }

  const getUnitById = (unitId) => {
    const number = getunitNumber(unitId)
    let unit = {}
    const newDirectoryEntries = []

    global.internalApi
      .getUnit(unitId)
      .then(
        ({ properyOccupants, id, suite: number, legalLevel, legalUnit }) => {
          const occs = _.map(
            properyOccupants,
            ({
              id,
              firstName,
              lastName,
              email,
              phone,
              propertyId: unitId,
            }) => ({
              id,
              firstName,
              lastName,
              email,
              phone,
              unitId,
            })
          )

          unit = {
            id,
            number,
            tags: [
              "Floor: " + legalLevel,
              "Riser: " + legalUnit,
              "Exposure: East",
            ],
            occupants: occs,
            directoryEntries: [],
          }
        }
      )
      .then(() => {
        global.externalApi
          .getDirectoryEntry(global.buildingNum, number)
          .then((data) => {
            _.map(data, ({ nickname, building, household }) => {
              _.map(nickname, (o) => {
                newDirectoryEntries.push({
                  id: o.hu_no,
                  name: o.username,
                  buildingId: building,
                  unitId: household,
                })
              })
            })

            unit.directoryEntries = newDirectoryEntries

            setUnits((units) => [...units, unit])
            setEmptyOccupant({
              id: 0,
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              unitId: unit.id,
            })
            setEmptyDirectory({
              id: 0,
              name: "",
              buildingId: global.buildingNum,
              unitId: number,
            })
          })
      })
  }

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
    entity.unitId = getunitId(entity.number)

    if (entity.id > 0) global.internalApi.updateOccupant(entity)
    else {
      global.internalApi.addOccupant(entity).then(() => {
        getOccupants(global.buildingId)
      })
    }

    console.log("occupant updated: ", entity)
  }

  const handleOccupantDelete = (entities) => {
    _.each(entities, (entity) => {
      global.internalApi.deleteOccupants(entity.id).then(() => {
        getUnitById(entity.unitId)
      })
    })
  }

  const getDirectoryEntity = () => {
    const newDirectoryEntries = []
    global.externalApi.getAllDirectoryEntry().then((data) => {
      _.map(data, ({ nickname }) => {
        _.map(
          nickname,
          ({
            hu_no: id,
            username: name,
            building: buildingId,
            household: number,
          }) => {
            newDirectoryEntries.push({
              id,
              name,
              buildingId,
              number,
            })
          }
        )
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

  const handleDirectoryDelete = (entities) =>
    _.each(entities, ({ buildingId, number: unitId, id: hu_no }) => {
      const name = JSON.stringify([{ hu_no }]).replace(/'/g, "''")

      console.log("deleting ", buildingId, unitId, name)

      global.externalApi
        .deleteDirectoryEntry(buildingId, unitId, name)
        .then(() => {
          getDirectoryEntity()
        })
    })

  useEffect(() => {
    getUnits(global.buildingId)
    getOccupants(global.buildingId)
    getDirectoryEntity()
  }, [])

  return (
    <Grid container>
      <Grid item xs={6}>
        <EntityCrudSummaryCard
          searchHintText="Suite number, first / last name"
          entityName="Suite Occupants"
          entityProperties={[
            { label: "number", name: "number" },
            { label: "first name", name: "firstName" },
            { label: "last name", name: "lastName" },
          ]}
          entitySchema={[
            { label: "Suite number", name: "number", type: "text" },
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
        />
      </Grid>
      <Grid item xs={6}>
        <EntityCrudSummaryCard
          searchHintText="Suite number, name"
          entityName="Directory Entries"
          entityProperties={[
            { label: "Number", name: "number" },
            { label: "Name", name: "name" },
          ]}
          entitySchema={[
            { label: "suite number", name: "number", type: "text" },
            { label: "name", name: "name", type: "text" },
          ]}
          entities={directoryEntries}
          emptyEntity={emptyDirectory}
          onEntitySave={handleDirectorySave}
          onEntityAdd={handleDirectoryAdd}
          onEntitiesDelete={handleDirectoryDelete}
        />
      </Grid>
    </Grid>
  )
}
