import _ from "lodash"
import React, { useEffect, useState } from "react"

import {
  Grid,
  Dialog,
  Button,
  TextField,
  Card,
  CardActions,
  CardHeader,
  CardContent,
} from "@material-ui/core"
import { DatePicker } from "@material-ui/pickers"

import {
  AutoCompleteSearch,
  EntityCrudSummaryCard,
  EntityCrudSelectField,
} from "."

export default () => {
  const [ownership, setOwnership] = useState({
    id: 1,
    activateDate: new Date(),
    inactivateDate: new Date(),
    typeId: 0,
    notes: "",
    avtive: true,
    people: [],
    properties: [],
  })
  const [unitNumber, setUnitNumber] = useState("")
  const [unitId, setUnitId] = useState("")
  const [buildingId, setBuildingId] = useState("")
  const [emptyPeople, setEmptyPeople] = useState({})
  const [emptyProperty, setEmptyProperty] = useState({})
  const [units, setUnits] = useState([])
  const [ownershipTypes, setOwnershipTypes] = useState([])
  const [ownershipPersonTypes, setOwnershipPersonTypes] = useState([])
  const [ownershipProperties, setOwnershipProperties] = useState([])
  const [showSuite, setShowSuite] = useState(false)
  const [addressOptions, setAddressOptions] = useState({})
  const [open, setOpen] = useState(false)

  useEffect(() => {
    getOwnershipTypes()
    getOwnershipPersonTypes()
    getUnits(global.buildingId)
  }, [])

  const handleOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const getOwnershipTypes = () =>
    global.internalApi.getOwnershipTypes().then((data) => {
      const types = _.map(data, ({ id: value, description: display }) => ({
        value,
        display,
      }))

      setOwnershipTypes(types)
    })

  const getOwnershipPersonTypes = () =>
    global.internalApi.getOwnershipPersonTypes().then((data) => {
      const types = _.map(data, ({ id: value, description: display }) => ({
        value,
        display,
      }))

      setOwnershipPersonTypes(types)
    })

  const getUnits = (newBuildingId) =>
    global.internalApi.getBuildingUnits(newBuildingId).then((data) => {
      const newUnits = _.map(data, ({ id, commaxId: number }) => ({
        id,
        number,
      }))

      setUnits(newUnits)
      setBuildingId(newBuildingId)

      const options = _.fromPairs(
        _.map(_.sortBy(units, ["number"]), ({ number }) => [
          `Suite ${number}`,
          [number],
        ])
      )

      console.log("options", options)

      setAddressOptions(options)
    })

  const getunitId = (unitNumber) => {
    const o = _.filter(units, ({ number }) => number === unitNumber)

    return o.length > 0 ? o[0].id : null
  }

  const getOwnershipByNumber = (number) => {
    const newUnitId = getunitId(number)

    setUnitNumber(number)
    setUnitId(newUnitId)

    getOwnershipById(newUnitId)
  }

  const getOwnershipById = (unitId) => {
    let newOwnership = {}

    handleClose()

    global.internalApi
      .getOwnershipByUnit(unitId)
      .then((data) => {
        const people = _.map(data.ownershipPersons, (o) => {
          let fullAddress = o.address

          if (o.suite && o.suite.trim().length > 0) {
            fullAddress += " Suite " + o.suite
          }
          if (o.city && o.city.trim().length > 0) {
            fullAddress += ", " + o.city
          }
          if (o.province && o.province.trim().length > 0) {
            fullAddress += ", " + o.province
          }
          if (o.postcodeZip && o.postcodeZip.trim().length > 0) {
            fullAddress += ", " + o.postcodeZip
          }
          if (o.country && o.country.trim().length > 0) {
            fullAddress += ", " + o.country
          }

          return {
            id: o.id,
            salutation: o.salutation,
            firstName: o.firstName,
            middleName: o.middleName,
            lastName: o.lastName,
            address: o.address,
            suite: o.suite,
            city: o.city,
            province: o.province,
            postcodeZip: o.postcodeZip,
            country: o.country,
            email: o.email,
            homePhone: o.homePhone,
            cellPhone: o.cellPhone,
            workPhone: o.workPhone,
            typeId: o.typeId,
            ownershipId: o.ownership,
            type: o.type.description,
            fullAddress: fullAddress,
          }
        })

        const properties = _.map(data.properties, (o) => {
          return {
            id: o.id,
            ownershipId: data.id,
            legalLevel: o.legalLevel,
            legalUnit: o.legalUnit,
            suite: o.suite,
            design: o.design,
            size: o.size,
            typeId: o.typeId,
            type: o.type.description,
          }
        })

        const activateDate = new Date(data.activateDate)
        const inactivateDate = new Date(data.inActivateDate)

        newOwnership = {
          id: data.id,
          activateDate: activateDate,
          inactivateDate:
            inactivateDate.getUTCFullYear() <= 1 ? undefined : inactivateDate,
          notes: data.notes ? data.notes : "",
          active: data.active,
          typeId: data.typeId,
          people: people,
          properties: properties,
        }

        const newEmptyPeople = {
          id: 0,
          salutation: "",
          firstName: "",
          middleName: "",
          lastName: "",
          address: "",
          suite: "",
          city: "",
          province: "",
          postcodeZip: "",
          country: "",
          email: "",
          homePhone: "",
          cellPhone: "",
          workPhone: "",
          typeId: 1,
          ownershipId: newOwnership.id,
          type: "",
        }

        const newEmptyProperty = {
          id: 0,
          ownershipId: newOwnership.id,
        }

        setOwnership(newOwnership)
        setEmptyPeople(newEmptyPeople)
        setEmptyProperty(newEmptyProperty)
      })
      .then(() =>
        global.internalApi
          .getBuildingOwnershipUnits(buildingId)
          .then((data) => {
            const newOwnershipProperties = _.map(
              data,
              ({ id: value, suite, type: { description } }) => ({
                value,
                display: `${suite} -  ${description}`,
              })
            )

            setOwnershipProperties(newOwnershipProperties)
          })
      )
  }

  const handleSearchChange = (unit) => {
    console.log(`loading unit ${unit}`)

    getOwnershipByNumber(unit)

    setShowSuite(true)
  }

  const handlePersonSave = (entity) => {
    if (entity.id > 0)
      global.internalApi.updateOwnershipPerson(entity).then(() => {
        getOwnershipById(unitId)
      })
    else
      global.internalApi.addOwnershipPerson(entity).then(() => {
        getOwnershipById(unitId)
      })

    console.log("Person updated: ", entity)
  }

  const handlePersonDelete = (entities) => {
    _.each(entities, (entity) => {
      global.internalApi.deleteOwnershipPerson(entity.id).then(() => {
        getOwnershipById(unitId)
      })
    })
  }

  const handleOwnershipUnitSave = (entity) => {
    if (entity.id > 0)
      global.internalApi
        .addOwnershipUnit(entity.id, entity.ownershipId)
        .then(() => {
          getOwnershipById(unitId)
        })
  }

  const handleOwnershipUnitDelete = (entities) =>
    _.each(entities, (entity) => {
      global.internalApi
        .deleteOwnershipUnit(entity.id, entity.ownershipId)
        .then(() => {
          getOwnershipById(unitId)
        })
    })

  const handleOwnershipSave = () => {
    if (ownership.id > 0)
      global.internalApi.updateOwnership(ownership).then(() => {
        getOwnershipById(unitId)
      })
  }

  const handleTransfer = () => {
    handleClose()

    if (ownership.id > 0)
      global.internalApi.transferOwnership(ownership.id).then(() => {
        getOwnershipById(unitId)
      })
  }

  const handleDatePickerChange_active = (event, value) =>
    setOwnership((ownership) =>
      _.assign(ownership, {
        activateDate: value,
      })
    )

  const handleDatePickerChange_inactive = (event, value) =>
    setOwnership((ownership) =>
      _.assign(ownership, {
        inactivateDate: value,
      })
    )

  const handleSelectChange = (value) =>
    setOwnership((owneship) => _.assign(ownership, { typeId: value }))

  const handleNotesChange = (event, value) =>
    setOwnership((ownership) =>
      _.assign(ownership, {
        notes: value,
      })
    )

  const formatDate = new global.Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format

  const transferActions = [
    <Button key="cancel" label="Cancel" primary={true} onClick={handleClose} />,
    <Button
      key="submit"
      label="Submit"
      primary={true}
      disabled={false}
      onClick={handleTransfer}
    />,
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
        <Dialog
          title="Transfer Ownership"
          actions={transferActions}
          modal={true}
          open={open}
        >
          This will transfer the current ownership. Continue?
        </Dialog>
        <Grid container>
          <Grid container xs={12}>
            <Grid item xs={5}>
              <Card style={{ textAlign: "left", margin: "20px" }}>
                <CardHeader
                  title={"Suite " + unitNumber}
                  subtitle="Ownership detail"
                />
                <CardContent>
                  <Grid container>
                    <Grid container xs={12}>
                      <Grid item xs={6}>
                        <div>
                          <DatePicker
                            floatingLabelText="Activate Date"
                            floatingLabelFixed={true}
                            autoOk={true}
                            firstDayOfWeek={0}
                            formatDate={formatDate}
                            value={ownership.activateDate}
                            onChange={handleDatePickerChange_active}
                          />
                          <DatePicker
                            floatingLabelText="Inactivate Date"
                            floatingLabelFixed={true}
                            autoOk={true}
                            firstDayOfWeek={0}
                            formatDate={formatDate}
                            value={ownership.inactivateDate}
                            onChange={handleDatePickerChange_inactive}
                          />
                          <EntityCrudSelectField
                            label="Type"
                            value={ownership.typeId}
                            optionValues={ownershipTypes}
                            handleChange={handleSelectChange}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div>
                          <TextField
                            floatingLabelText="Notes"
                            floatingLabelFixed={true}
                            fullWidth={true}
                            multiLine={true}
                            rows={1}
                            rowsMax={5}
                            value={ownership.notes}
                            onChange={handleNotesChange}
                          />
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    label="Save"
                    primary={true}
                    style={{ marginRight: "2em" }}
                    onClick={handleOwnershipSave}
                  />
                  <Button
                    variant="contained"
                    label="Transfer"
                    primary={false}
                    style={{ marginRight: "2em" }}
                    onClick={handleOpen}
                  />
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={7}>
              <EntityCrudSummaryCard
                searchHintText="Suite number"
                entityName="Property"
                entityProperties={[
                  { label: "suite", name: "suite" },
                  { label: "type", name: "type" },
                  { label: "legal Level", name: "legalLevel" },
                  { label: "legal Unit", name: "legalUnit" },
                ]}
                entitySchema={[
                  {
                    label: "Property",
                    name: "id",
                    type: "options",
                    optionValues: ownershipProperties,
                  },
                ]}
                disableEdit={true}
                NewEntityLable="Parking\Locker"
                entities={ownership.properties}
                emptyEntity={emptyProperty}
                onEntityAdd={handleOwnershipUnitSave}
                onEntitiesDelete={handleOwnershipUnitDelete}
              />
            </Grid>
            <Grid item xs={12}>
              <EntityCrudSummaryCard
                searchHintText="First / last name"
                entityName="People"
                entityProperties={[
                  { label: "Type", name: "type" },
                  { label: "first name", name: "firstName" },
                  { label: "last name", name: "lastName" },
                  { label: "Address", name: "fullAddress" },
                  { label: "Email", name: "email" },
                  { label: "home Phone", name: "homePhone" },
                  { label: "business Phone", name: "workPhone" },
                  { label: "Mobile", name: "cellPhone" },
                ]}
                entitySchema={[
                  {
                    label: "type",
                    name: "typeId",
                    type: "options",
                    optionValues: ownershipPersonTypes,
                  },
                  { label: "salutation", name: "salutation", type: "text" },
                  { label: "first name", name: "firstName", type: "text" },
                  { label: "middle name", name: "middleName", type: "text" },
                  { label: "last name", name: "lastName", type: "text" },
                  { label: "address", name: "address", type: "text" },
                  { label: "suite", name: "suite", type: "text" },
                  { label: "city", name: "city", type: "text" },
                  { label: "province", name: "province", type: "text" },
                  {
                    label: "PostalCode/Zip",
                    name: "postalcodeZip",
                    type: "text",
                  },
                  { label: "country", name: "country", type: "text" },
                  { label: "email", name: "email", type: "text" },
                  { label: "home Phone", name: "homePhone", type: "text" },
                  {
                    label: "business Phone",
                    name: "workPhone",
                    type: "text",
                  },
                  { label: "Mobile", name: "cellPhone", type: "text" },
                ]}
                entities={ownership.people}
                emptyEntity={emptyPeople}
                onEntitySave={handlePersonSave}
                onEntityAdd={handlePersonSave}
                onEntitiesDelete={handlePersonDelete}
              />
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
