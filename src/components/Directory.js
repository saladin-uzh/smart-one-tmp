import _ from "lodash"
import React, { useState, useEffect, Fragment } from "react"
import moment from "moment"

import { Grid, Chip, Dialog, Button, Fab } from "@material-ui/core"
import { Autocomplete, createFilterOptions } from "@material-ui/lab"
import { AddRounded } from "@material-ui/icons"

import { MessageList, AutoCompleteSearch, EntityCrudSummaryCard } from "."
import { spacings } from "../constants"
import { TextFieldNoBorder, IconDirectories, IconOccupants } from "../ui"

export default () => {
  const [unit, setUnit] = useState({
    id: 1,
    number: "",
    tags: [],
    occupants: [],
    directoryEntries: [],
  })
  const [emptyOccupant, setEmptyOccupant] = useState({})
  const [emptyDirectory, setEmptyDirectory] = useState({})
  const [units, setUnits] = useState([])
  const [showSuite, setShowSuite] = useState(false)
  const [showNewTag, setShowNewTag] = useState(false)
  const [addressOptions, setAddressOptions] = useState([])
  const [tagList, setTagList] = useState([])
  const [openAlert, setOpenAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [newTagValue, setNewTagValue] = useState("")

  useEffect(() => {
    getUnits(global.buildingId)
  }, [])

  useEffect(() => {
    console.group("Component did mount:")
    console.log("Unit: ", unit)
    console.log("Occupants: ", unit.occupants)
    console.log("Tags: ", tagList)
    console.log("Notifs: ", messages)
    console.groupEnd()
  }, [unit, tagList])

  const handleOpenAlert = (message) => {
    setOpenAlert(true)
    setAlertMessage(message)
  }

  const handleCloseAlert = () => setOpenAlert(false)

  const getUnits = (buildingId) => {
    global.internalApi.getBuildingUnits(buildingId).then((data) => {
      const newUnits = _.map(data, ({ id, commaxId: number }) => ({
        id,
        number,
      }))

      console.warn(newUnits)

      setUnits(newUnits)

      const options = _.map(
        _.sortBy(newUnits, ["number"]),
        ({ number }) => number
      )

      console.log("options: ", options)

      setAddressOptions(options)
    })
  }

  const getunitId = (number) => {
    const index = units.findIndex((val) => val.number === number)

    return units[index >= 0 ? index : 0].id
  }

  const getunitNumber = (id) => {
    const index = units.findIndex((val) => val.id === id)

    return index >= 0 ? units[index].number : 0
  }

  const getUnitByNumber = (number) => getUnitById(getunitId(number))

  const getUnitById = (unitId) => {
    const number = getunitNumber(unitId)
    let newUnit = {}
    const newDirectoryEntries = []

    global.internalApi
      .getUnit(unitId)
      .then(({ properyOccupants, id, suite: number, tags }) => {
        const occs = _.map(
          properyOccupants,
          ({ id, firstName, lastName, email, phone, propertyId: unitId }) => ({
            id,
            firstName,
            lastName,
            email,
            phone,
            unitId,
          })
        )

        newUnit = {
          id,
          number,
          tags: tags,
          occupants: occs,
          directoryEntries: [],
        }
      })
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

            newUnit.directoryEntries = newDirectoryEntries

            setUnit(newUnit)

            setEmptyOccupant({
              id: 0,
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              unitId: newUnit.id,
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

  const getNotifications = (unitNum) => {
    if (!unitNum) unitNum = unit.number

    global.externalApi
      .getBuildingNotifications(global.buildingNum)
      .then((data) => {
        console.log(data)
        const notifications = _.map(
          data,
          ({
            m_house,
            m_no: id,
            m_subject,
            m_type: type,
            m_content,
            m_wdate,
            m_edate,
          }) => {
            const allAddressees = _.uniq(
              _.map(m_house, (addr) => addr.House.split("-")[1])
            )

            const displayAddressees =
              m_house.length > 4
                ? `${allAddressees[0]}, ${allAddressees[1]}, ${
                    allAddressees[2]
                  } and ${allAddressees.length - 3} others`
                : _.sum(allAddressees.join(", "))

            const parser = new DOMParser()

            return {
              id,
              type,
              subject: parser.parseFromString(
                "<!doctype html><body>" + m_subject,
                "text/html"
              ).body.textContent,
              message: parser.parseFromString(
                "<!doctype html><body>" + m_content,
                "text/html"
              ).body.textContent,
              allSentTo: allAddressees,
              sentTo: displayAddressees,
              sendDate: moment(m_wdate, "YYYYMMDDHHmm").unix(),
              expires: moment(m_edate, "YYYYMMDDHHmm").unix(),
            }
          }
        )

        console.log(notifications)

        const unitNotifications = _.filter(notifications, (msg) =>
          msg.allSentTo.includes(unitNum.replace("\r", ""))
        )

        setMessages(unitNotifications)
      })
  }

  const getDirectoryEntity = (buildingId, unitId) => {
    let newDirectoryEntries = []

    global.externalApi.getDirectoryEntry(buildingId, unitId).then((data) => {
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

      setUnit((unit) => ({ ...unit, directoryEntries: newDirectoryEntries }))
    })
  }

  const handleSearchChange = (selection) => {
    if (Boolean(selection)) {
      getUnitByNumber(selection) // unit, emptyOccupant, emptyDirecyory
      getNotifications(selection) // messages

      setShowSuite(true)
    } else setShowSuite(false)
  }

  const handleOccupantAdd = (entity) => {
    if (entity.id > 0) global.internalApi.updateOccupant(entity)
    else
      global.internalApi
        .addOccupant(entity)
        .then(() => getUnitById(entity.unitId))

    console.log("occupant updated: ", entity)
  }

  const handleOccupantDelete = (entities) => {
    _.each(entities, (entity) => {
      global.internalApi.deleteOccupants(entity.id).then(() => {
        getUnitByNumber(unit.number)
      })
    })
  }

  const formateName = (name) => name.trim().replace(/\s\s+/g, " ")

  const isValueName = (name) => {
    if (name.includes("#")) {
      return {
        valid: false,
        error: "The # symbol cannot appear in the lobby directory.",
      }
    }

    if (name.length > global.maxNameLength) {
      return {
        valid: false,
        error: `The Maximum Length for Name is ${global.maxNameLength} Characters.`,
      }
    }

    const names = name.split(" ")
    const tooLong = names.some((val) => val.length > global.maxWordLength)

    if (tooLong) {
      return {
        valid: false,
        error: `The Maximum Length for a First or Last Name is ${global.maxWordLength} Characters.`,
      }
    }

    return { valid: true, error: "" }
  }

  // const handleDirectorySave = ({ buildingId, unitId, name, id: hu_no }) => {
  //   const username = formateName(name)

  //   let result = isValueName(name)

  //   if (result.valid) {
  //     const dirName = JSON.stringify([{ hu_no, username }]).replace(/'/g, "''")

  //     global.externalApi
  //       .setDirectoryEntry(buildingId, unitId, dirName)
  //       .then(() => {
  //         getDirectoryEntity(buildingId, unitId)
  //       })
  //   } else getDirectoryEntity(buildingId, unitId)

  //   return result.error
  // }

  const handleDirectoryAdd = ({ buildingId, unitId, name, id: hu_no }) => {
    const username = formateName(name)

    const result = isValueName(username)

    if (result.valid) {
      const dirName = JSON.stringify([{ hu_no, username }]).replace(/'/g, '"')

      console.log(dirName)
      global.externalApi
        .addDirectoryEntry(buildingId, unitId, dirName)
        .then(() => {
          getDirectoryEntity(buildingId, unitId)
        })
    } else getDirectoryEntity(buildingId, unitId)

    // return result.error
  }

  const handleDirectoryDelete = (entities) => {
    const name = []
    let newBuildingId = ""
    let newUnitId = ""

    _.each(entities, ({ buildingId, unitId, id: hu_no }) => {
      newBuildingId = buildingId
      newUnitId = unitId

      name.push({ hu_no })
    })

    const dirName = JSON.stringify(name).replace(/'/g, "''")

    console.log("deleting ", newBuildingId, newUnitId, name)

    global.externalApi
      .deleteDirectoryEntry(newBuildingId, newUnitId, dirName)
      .then(() => {
        getDirectoryEntity(newBuildingId, newUnitId)
      })
  }

  const handleAddTag = () =>
    global.internalApi.getExistBuildingTags(global.buildingId).then((data) => {
      let tags = data

      console.log(data)
      tags = data.filter((tag) => !unit.tags.some((val) => val.tag === tag))

      console.log(tags)

      setShowNewTag((showNewTag) => !showNewTag)
      setNewTagValue("")
      setTagList(tags)
    })

  const handleNewTagValueChange = (event, value) =>
    setNewTagValue(_.capitalize(value))

  const handleFilterTag = createFilterOptions({
    stringify: (tag) => tag.toLowerCase(),
  })

  const handleTagSave = () => {
    let exist = unit.tags.some((val) => val.tag === newTagValue)

    if (exist) {
      handleOpenAlert("The Same Tag Cannot be Added Twice.")
      return
    }

    const newTag = {
      tag: newTagValue,
      PropertyId: unit.id,
    }

    global.internalApi.saveTag(newTag).then(({ id, tag, PropertyId }) => {
      const addedTag = {
        id,
        tag,
        PropertyId,
      }

      setUnit((unit) =>
        _.assign(unit, {
          tags: unit.tags.concat(addedTag),
        })
      )

      setShowNewTag(false)
    })
  }

  const handleRemoveTag = (tag) =>
    global.internalApi.deleteTag(tag).then(() => {
      setUnit((unit) =>
        _.assign(unit, {
          tags: _.without(unit.tags, tag),
        })
      )

      setShowNewTag(false)
    })

  const handleMessageDelete = ({ id }) =>
    global.externalApi.deleteNotification(id).then(() => {
      getNotifications(unit.number)
    })

  const actions = [
    <Button key="ok" label="OK" primary={true} onClick={handleCloseAlert} />,
  ]

  return (
    <Grid
      container
      style={{
        width: "auto",
        minHeight: "100%",
        minWidth: 1070,
        flexGrow: 1,
        margin: 0,
        padding: spacings.large,
        textAlign: "left",
      }}
      alignItems="flex-start"
      alignContent="flex-start"
      justify="flex-start"
      spacing={5}
    >
      <Grid item container xs={showSuite ? 7 : 12}>
        <Grid
          item
          container
          xs={12}
          justify={showSuite ? "space-between" : "flex-end"}
          alignItems="flex-start"
          style={{ paddingBottom: spacings.xSmall }}
        >
          {showSuite && (
            <Grid item xs={8}>
              <h1
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "flex-end",
                  fontSize: 36,
                }}
              >
                Suite {unit.number}
              </h1>
            </Grid>
          )}

          <Grid
            item
            xs={4}
            style={{ minWidth: 150, marginBottom: spacings.xxLarge }}
          >
            <AutoCompleteSearch
              addressOptions={addressOptions}
              handleAddressUpdate={handleSearchChange}
              hintText="Suite number"
            />
          </Grid>

          {!showSuite && (
            <Grid item xs={12}>
              <span style={{ fontSize: "1.3rem" }}>
                Please select <strong>a suite</strong>
              </span>
            </Grid>
          )}

          {showSuite && (
            <Grid item xs={12} container alignItems="center">
              <Grid item>
                <Fab
                  onClick={handleAddTag}
                  style={{
                    marginRight: spacings.xSmall,
                  }}
                >
                  <AddRounded
                    style={{
                      transition: "transform .1s linear",
                      transitionDelay: "0",
                      transform: `rotate(${showNewTag ? "45deg" : 0})`,
                    }}
                  />
                </Fab>
              </Grid>

              {_.map(unit.tags, (tag) => (
                <Grid item key={`pnbsYhTAm${tag.id}`}>
                  <Chip
                    key={tag}
                    label={tag.tag}
                    style={{
                      marginRight: spacings.xxSmall,
                      padding: ".3em",
                    }}
                    onDelete={() => {
                      handleRemoveTag(tag)
                    }}
                  />
                </Grid>
              ))}

              {showNewTag && (
                <Grid item container style={{ width: "auto" }}>
                  <Autocomplete
                    ListboxProps={{
                      style: { maxHeight: 200, overflow: "auto" },
                    }}
                    inputValue={newTagValue}
                    onInputChange={handleNewTagValueChange}
                    options={tagList}
                    filterOptions={handleFilterTag}
                    freeSolo
                    renderInput={(params) => (
                      <TextFieldNoBorder isTiny {...params} autoFocus />
                    )}
                  />

                  <Button
                    size="small"
                    style={{ marginLeft: spacings.xxSmall }}
                    onClick={handleTagSave}
                  >
                    Save
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>

        {!showSuite && (
          <Grid
            item
            xs={12}
            container
            spacing={4}
            alignItems="flex-start"
            alignContent="flex-start"
          >
            {addressOptions.map((option) => (
              <Grid item key={`lZUNLCNrM${option}`}>
                <Button
                  style={{
                    padding: spacings.medium,
                    cursor: "pointer",
                  }}
                  key={`${option}KMvSIrXV7`}
                  label={option}
                  color="secondary"
                  onClick={() => handleSearchChange(option)}
                >
                  {option}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}

        {showSuite && (
          <Fragment>
            <Grid item xs={12} style={{ marginBottom: spacings.xLarge }}>
              <EntityCrudSummaryCard
                searchHintText="First / last name"
                entityName="Occupants"
                NewEntityLable="New Occupants"
                icon={IconOccupants}
                entityProperties={[
                  { label: "first name", name: "firstName" },
                  { label: "last name", name: "lastName" },
                  { label: "phone", name: "phone" },
                ]}
                entitySchema={[
                  { label: "first name", name: "firstName", type: "text" },
                  { label: "last name", name: "lastName", type: "text" },
                  { label: "phone", name: "phone", type: "text" },
                  { label: "email", name: "email", type: "text" },
                ]}
                entities={unit.occupants}
                emptyEntity={emptyOccupant}
                // onEntitySave={handleOccupantAdd}
                onEntityAdd={handleOccupantAdd}
                onEntitiesDelete={handleOccupantDelete}
              />
            </Grid>

            <Grid item xs={12}>
              <EntityCrudSummaryCard
                searchHintText="Name"
                entityName="Directory Entries"
                icon={IconDirectories}
                entityProperties={[{ label: "name", name: "name" }]}
                entitySchema={[{ label: "name", name: "name", type: "text" }]}
                entities={unit.directoryEntries}
                emptyEntity={emptyDirectory}
                // onEntitySave={handleDirectorySave}
                onEntityAdd={handleDirectoryAdd}
                onEntitiesDelete={handleDirectoryDelete}
                disableAdd={
                  unit.directoryEntries.length >= global.maxLobbyEntries
                }
              />
            </Grid>

            <Dialog
              actions={actions}
              modal={true}
              open={openAlert}
              onRequestClose={handleCloseAlert}
            >
              {alertMessage}
            </Dialog>
          </Fragment>
        )}
      </Grid>

      {showSuite && (
        <Grid item container xs={5}>
          <Grid item xs={12}>
            <MessageList onDelete={handleMessageDelete} messages={messages} />
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}
