import _ from "lodash"
import React, { useState, useEffect, Fragment, useCallback } from "react"
import moment from "moment"

import { Grid, Chip, Button, Fab } from "@material-ui/core"
import { Autocomplete, createFilterOptions } from "@material-ui/lab"
import { AddRounded } from "@material-ui/icons"

import { MessageList, AutoCompleteSearch, EntityCrudSummaryCard } from "."
import { spacings } from "../constants"
import {
  TextFieldNoBorder,
  IconDirectories,
  IconOccupants,
  PageContainer,
} from "../ui"
import withErrorHandling from "../utils/withErrorHandling"

export default withErrorHandling(({ handleError }) => {
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
  const [messages, setMessages] = useState([])
  const [newTagValue, setNewTagValue] = useState("")

  const getUnits = useCallback(
    (buildingId) => {
      global.internalApi.getBuildingUnits(buildingId).then(
        (data) => {
          const newUnits = _.map(data, ({ id, commaxId: number }) => ({
            id,
            number: number.replace("\r", ""),
          }))

          setUnits(newUnits)

          const options = _.map(
            _.sortBy(newUnits, ["number"]),
            ({ number }) => number
          )

          setAddressOptions(options)
        },
        ({ message }) => handleError(message)
      )
    },
    [handleError]
  )

  useEffect(() => {
    getUnits(global.buildingId)
  }, [getUnits])

  useEffect(() => {
    console.group("Component did mount:")
    console.log("Unit: ", unit)
    // console.log("Occupants: ", unit.occupants)
    // console.log("Tags: ", tagList)
    // console.log("Notifs: ", messages)
    console.groupEnd()
  }, [unit /**, tagList, messages*/])

  const getunitId = (unitNumber) =>
    units.find(({ number }) => number === unitNumber).id

  const getunitNumber = (unitId) => units.find(({ id }) => id === unitId).number

  const getUnitByNumber = (number) => getUnitById(getunitId(number))

  const getUnitById = (unitId) => {
    const number = getunitNumber(unitId)
    let newUnit = {}
    const newDirectoryEntries = []

    global.internalApi
      .getUnit(unitId)
      .then(
        ({ properyOccupants, id, suite: number, tags }) => {
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

          newUnit = {
            id,
            number,
            tags: tags,
            occupants: occs,
            directoryEntries: [],
          }
        },
        ({ message }) => handleError(message)
      )
      .then(
        () => {
          global.externalApi
            .getDirectoryEntry(global.buildingNum, number)
            .then((data) => {
              _.map(data, ({ nickname, building, household }) => {
                _.map(nickname, (nick) => {
                  newDirectoryEntries.push({
                    id: nick.hu_no,
                    name: Boolean(nick.username)
                      ? nick.username
                      : "<empty_name>",
                    buildingId: building,
                    number: household,
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
        },
        ({ message }) => handleError(message)
      )
  }

  const getNotifications = (unitNum) => {
    if (!unitNum) unitNum = unit.number

    global.externalApi.getBuildingNotifications(global.buildingNum).then(
      (data) => {
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

        const unitNotifications = _.filter(notifications, (msg) =>
          msg.allSentTo.includes(unitNum)
        )

        setMessages(unitNotifications)
      },
      ({ message }) => handleError(message)
    )
  }

  const getDirectoryEntity = (buildingId, unitId) => {
    let newDirectoryEntries = []

    global.externalApi.getDirectoryEntry(buildingId, unitId).then(
      (data) => {
        _.map(data, ({ nickname, building: buildingId, household: number }) => {
          _.map(nickname, ({ hu_no: id, username: name }) => {
            newDirectoryEntries.push({
              id,
              name,
              buildingId,
              number,
            })
          })
        })

        setUnit((unit) => ({ ...unit, directoryEntries: newDirectoryEntries }))
      },
      ({ message }) => handleError(message)
    )
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
      global.internalApi.addOccupant(entity).then(
        () => getUnitById(entity.unitId),
        ({ message }) => handleError(message)
      )
  }

  const handleOccupantDelete = (selection) =>
    selection.length > 0
      ? selection.forEach((id) =>
          global.internalApi.deleteOccupants(id).then(
            () => {
              getUnitByNumber(unit.number)
            },
            ({ message }) => handleError(message)
          )
        )
      : handleError("Nothing selected!")

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

  const handleDirectorySave = ({ buildingId, unitId, name, id: hu_no }) => {
    const username = formateName(name)

    let result = isValueName(name)

    if (result.valid) {
      const dirName = JSON.stringify([{ hu_no, username }]).replace(/'/g, "''")

      global.externalApi.setDirectoryEntry(buildingId, unitId, dirName).then(
        () => {
          getDirectoryEntity(buildingId, unitId)
        },
        ({ message }) => handleError(message)
      )
    } else getDirectoryEntity(buildingId, unitId)

    return result.error
  }

  const handleDirectoryAdd = ({ buildingId, unitId, name, id: hu_no }) => {
    const username = formateName(name)

    const result = isValueName(username)

    if (result.valid) {
      const dirName = JSON.stringify([{ hu_no, username }]).replace(/'/g, '"')

      global.externalApi.addDirectoryEntry(buildingId, unitId, dirName).then(
        () => {
          getDirectoryEntity(buildingId, unitId)
        },
        ({ message }) => handleError(message)
      )
    } else getDirectoryEntity(buildingId, unitId)

    return handleError(result.error)
  }

  const handleDirectoryDelete = (selection) =>
    Boolean(selection.length)
      ? selection.forEach((dirId) => {
          const {
            buildingId,
            number,
            id: hu_no,
            name: username,
          } = unit.directoryEntries.find(({ id }) => id === dirId)

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

  const handleAddTag = () =>
    global.internalApi.getExistBuildingTags(global.buildingId).then(
      (data) => {
        let tags = data

        tags = data.filter((tag) => !unit.tags.some((val) => val.tag === tag))

        setShowNewTag((showNewTag) => !showNewTag)
        setNewTagValue("")
        setTagList(tags)
      },
      ({ message }) => handleError(message)
    )

  const handleNewTagValueChange = (event, value) =>
    setNewTagValue(_.capitalize(value))

  const handleFilterTag = createFilterOptions({
    stringify: (tag) => tag.toLowerCase(),
  })

  const handleTagSave = () => {
    let exist = unit.tags.some((val) => val.tag === newTagValue)

    if (exist) {
      handleError("The Same Tag Cannot be Added Twice.")
      return
    }

    const newTag = {
      tag: newTagValue,
      PropertyId: unit.id,
    }

    global.internalApi.saveTag(newTag).then(
      ({ id, tag, PropertyId }) => {
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
      },
      ({ message }) => handleError(message)
    )
  }

  const handleRemoveTag = (tag) =>
    global.internalApi.deleteTag(tag).then(
      () => {
        setShowNewTag(false)

        setUnit((unit) => ({
          ...unit,
          tags: _.without(unit.tags, tag),
        }))
      },
      ({ message }) => handleError(message)
    )

  const handleMessageDelete = ({ id }) =>
    global.externalApi.deleteNotification(id).then(
      () => {
        getNotifications(unit.number)
      },
      ({ message }) => handleError(message)
    )

  return (
    <PageContainer>
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
            style={{
              minWidth: 150,
              marginBottom: spacings.medium,
              marginTop: showSuite ? 0 : spacings.medium,
            }}
          >
            <AutoCompleteSearch
              addressOptions={addressOptions}
              handleAddressUpdate={handleSearchChange}
              hintText="Suite number"
            />
          </Grid>

          {!showSuite && (
            <Grid item xs={12}>
              <span style={{ fontSize: 24 }}>
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
                <Grid
                  item
                  container
                  style={{
                    width: "auto",
                  }}
                >
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
            <Grid item xs={12} style={{ marginBottom: spacings.medium }}>
              <EntityCrudSummaryCard
                searchHintText="First / last name"
                searchType="occupants"
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
                onEntitySave={handleOccupantAdd}
                onEntityAdd={handleOccupantAdd}
                onEntitiesDelete={handleOccupantDelete}
              />
            </Grid>

            <Grid item xs={12}>
              <EntityCrudSummaryCard
                searchHintText="Name"
                searchType="dir"
                entityName="Directory Entries"
                icon={IconDirectories}
                entityProperties={[{ label: "name", name: "name" }]}
                entitySchema={[{ label: "name", name: "name", type: "text" }]}
                entities={unit.directoryEntries}
                emptyEntity={emptyDirectory}
                onEntitySave={handleDirectorySave}
                onEntityAdd={handleDirectoryAdd}
                onEntitiesDelete={handleDirectoryDelete}
                disableAdd={
                  unit.directoryEntries.length >= global.maxLobbyEntries
                }
              />
            </Grid>
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
    </PageContainer>
  )
})
