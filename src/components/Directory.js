import _ from "lodash"
import React, { useState, useEffect } from "react"
import moment from "moment"

import {
  Card,
  CardHeader,
  CardContent,
  Button,
  IconButton,
} from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"
import { Grid, Chip, Dialog } from "@material-ui/core"
import { Add as ContentAdd } from "@material-ui/icons"

import { MessageList, AutoCompleteSearch, EntityCrudSummaryCard } from "."

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
  const [addressOptions, setAddressOptions] = useState({})
  const [tagList, setTagList] = useState([])
  const [openAlert, setOpenAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [newTagValue, setNewTagValue] = useState("")

  useEffect(() => {
    getUnits(global.buildingId)
  }, [])

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

      setUnits(newUnits)

      const options = _.fromPairs(
        _.map(_.sortBy(newUnits, ["number"]), (unit) => {
          return [`Suite ${unit.number}`, [unit.number]]
        })
      )

      console.log("options", options)

      setAddressOptions(options)
    })
  }

  const getunitId = (number) => {
    let o = _.filter(units, (o) => o.number === number)

    return o.length > 0 ? o[0].id : null
  }

  const getunitNumber = (id) => {
    let o = _.filter(units, (o) => o.id === id)

    return o.length > 0 ? o[0].number : null
  }

  const getUnitByNumber = (number) => getUnitById(getunitId(number))

  const getUnitById = (unitId) => {
    const number = getunitNumber(unitId)
    let unit = {}
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

        unit = {
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

            unit.directoryEntries = newDirectoryEntries

            setUnit(unit)

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

  const getNotifications = (unitNum) => {
    if (!unitNum) unitNum = unit.number

    global.externalApi
      .getBuildingNotifications(global.buildingNum)
      .then((data) => {
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
                : _.sum(
                    _.map(allAddressees, (a) => {
                      return a + " "
                    })
                  )

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

      setUnit((unit) => ({ ...unit, newDirectoryEntries }))
    })
  }

  const handleSearchChange = (unit) => {
    console.log(`loading unit ${unit}`)

    getUnitByNumber(unit)
    getNotifications(unit[0])
    setShowSuite(true)
  }

  const handleOccupantSave = (entity) => {
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

  const handleDirectorySave = ({ buildingId, unitId, name, id: hu_no }) => {
    const username = formateName(name)

    let result = isValueName(name)

    if (result.valid) {
      const dirName = JSON.stringify([{ hu_no, username }]).replace(/'/g, "''")

      global.externalApi
        .setDirectoryEntry(buildingId, unitId, dirName)
        .then(() => {
          getDirectoryEntity(buildingId, unitId)
        })
    } else getDirectoryEntity(buildingId, unitId)

    return result.error
  }

  const handleDirectoryAdd = ({ buildingId, unitId, name, id: hu_no }) => {
    const username = formateName(name)

    let result = isValueName(name)

    if (result.valid) {
      const dirName = JSON.stringify([{ hu_no, username }]).replace(/'/g, "''")

      global.externalApi
        .addDirectoryEntry(buildingId, unitId, dirName)
        .then(() => {
          getDirectoryEntity(buildingId, unitId)
        })
    } else getDirectoryEntity(buildingId, unitId)

    return result.error
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

      if (unit) {
        tags = data.filter((tag) => !unit.tags.some((val) => val.tag === tag))
      }

      setShowNewTag((showNewTag) => !showNewTag)
      setNewTagValue("")
      setTagList(tags)
    })

  const handleNewTagValueChange = (value) => setNewTagValue(_.capitalize(value))

  const handleFilterTag = (searchText, key) =>
    searchText !== "" &&
    key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1

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
    <div>
      <AutoCompleteSearch
        addressOptions={addressOptions}
        handleAddressUpdate={handleSearchChange}
        hintText="Suite number"
      />
      <div style={{ display: showSuite ? "none" : "block" }}>
        <span
          style={{
            fontSize: "24px",
            color: "rgba(0,0,0,0.87)",
            lineHeight: "48px",
          }}
        >
          Please select a suite using the search above
        </span>
      </div>
      <div
        style={{
          display: showSuite ? "block" : "none",
          height: "730px",
          overflowY: "scroll",
          marginTop: "10px",
        }}
      >
        <div style={{ marginLeft: "15px", height: "48px" }}>
          <div
            style={{ marginLeft: "15px", display: "flex", flexWrap: "wrap" }}
          >
            {_.map(unit.tags, (tag) => (
              <Chip
                onRequestDelete={() => {
                  handleRemoveTag(tag)
                }}
                style={{ margin: 4 }}
              >
                {" "}
                {tag.tag}{" "}
              </Chip>
            ))}
            <IconButton
              iconStyle={{ width: 24, height: 24 }}
              style={{
                width: 36,
                height: 36,
                position: "relative",
                top: "-5px",
              }}
              onClick={handleAddTag}
            >
              <ContentAdd />
            </IconButton>
            <div style={{ display: showNewTag ? "block" : "none" }}>
              <Autocomplete
                style={{ height: "36px", marginLeft: "10px" }}
                listStyle={{ maxHeight: 200, overflow: "auto" }}
                hintText="Tag"
                searchText={newTagValue}
                dataSource={tagList}
                onUpdateInput={(searchText /**, dataSource, params*/) => {
                  handleNewTagValueChange(searchText)
                }}
                filter={handleFilterTag}
              />

              <Button
                label="Save"
                primary={true}
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  handleTagSave()
                }}
              ></Button>
            </div>
          </div>
          <span
            style={{
              fontSize: "36px",
              color: "rgba(0,0,0,0.87)",
              lineHeight: "48px",
              position: "relative",
              top: "-48px",
            }}
          >
            Suite {unit.number}{" "}
          </span>
        </div>

        <Grid container>
          <Grid container xs={5}>
            <Grid item xs={12}>
              <EntityCrudSummaryCard
                searchHintText="First / last name"
                entityName="Occupants"
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
                onEntitySave={handleOccupantSave}
                onEntityAdd={handleOccupantSave}
                onEntitiesDelete={handleOccupantDelete}
              />
            </Grid>
            <Grid item xs={12}>
              <EntityCrudSummaryCard
                searchHintText="Name"
                entityName="Directory Entries"
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
          </Grid>
          <Grid container xs={7}>
            <Grid item xs={12}>
              <Card style={{ textAlign: "left", margin: "20px" }}>
                <CardHeader title="Notifications" />
                <CardContent>
                  <MessageList
                    onDelete={handleMessageDelete}
                    unitId={unit.id}
                    messages={messages}
                    style={{ height: "400px" }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Dialog
            actions={actions}
            modal={true}
            open={openAlert}
            onRequestClose={handleCloseAlert}
          >
            {alertMessage}
          </Dialog>
        </Grid>
      </div>
    </div>
  )
}
