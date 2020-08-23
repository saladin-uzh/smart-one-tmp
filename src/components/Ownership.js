import _ from "lodash"
import React, { useEffect, useState, Fragment, useCallback } from "react"
import MomentUtils from "@date-io/moment"
import moment from "moment"

import {
  Grid,
  Dialog,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@material-ui/core"
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers"

import {
  AutoCompleteSearch,
  EntityCrudSummaryCard,
  EntityCrudSelectField,
} from "."
import { HouseRounded, PeopleRounded } from "@material-ui/icons"
import { spacings, radii, colors } from "../constants"
import { TextFieldUI, CardTilte, TabLink, PageContainer } from "../ui"
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom.min"
import withErrorHandling from "../utils/withErrorHandling"

export default withErrorHandling(({ handleError }) => {
  const [ownership, setOwnership] = useState({
    id: 1,
    activateDate: new Date(),
    inactivateDate: new Date(),
    typeId: "",
    notes: "",
    avtive: true,
    people: [],
    properties: [],
  })
  const [unitNumber, setUnitNumber] = useState("")
  const [unitId, setUnitId] = useState("")
  const [buildingId, setBuildingId] = useState(global.buildingId)
  const [emptyPeople, setEmptyPeople] = useState({})
  const [emptyProperty, setEmptyProperty] = useState({})
  const [units, setUnits] = useState([])
  const [ownershipTypes, setOwnershipTypes] = useState([])
  const [ownershipPersonTypes, setOwnershipPersonTypes] = useState([])
  const [ownershipProperties, setOwnershipProperties] = useState([])
  const [showSuite, setShowSuite] = useState(false)
  const [addressOptions, setAddressOptions] = useState([])
  const [open, setOpen] = useState(false)
  const {
    params: { tab: currentTab },
  } = useRouteMatch()

  const getUnits = useCallback(
    (newBuildingId = global.buildingId) => {
      if (buildingId !== newBuildingId) {
        setBuildingId(newBuildingId)
      }

      global.internalApi.getBuildingUnits(newBuildingId).then((data) => {
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
      })
    },
    [buildingId]
  )

  useEffect(() => {
    getOwnershipTypes()
    getOwnershipPersonTypes()
    getUnits()
  }, [getUnits])

  // useEffect(() => {
  //   console.group("Component did mount:")
  //   console.log("Units: ", units)
  //   console.log("Ownership: ", ownership)
  //   console.log("Ownership types: ", ownershipTypes)
  //   console.log("Ownership person types: ", ownershipPersonTypes)
  //   console.log("Ownership props: ", ownershipProperties)
  //   console.groupEnd()
  // }, [units, ownershipTypes, ownershipPersonTypes, ownershipProperties])

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

  const getunitId = (unitNumber) =>
    units.find(({ number }) => number === unitNumber).id

  const getOwnershipByNumber = (number) => {
    const newUnitId = getunitId(number)

    setUnitNumber(number)
    setUnitId(newUnitId)

    getOwnershipById(newUnitId)
  }

  const getOwnershipById = (unitId) => {
    let newOwnership = {}

    global.internalApi
      .getOwnershipByUnit(unitId)
      .then((data) => {
        console.warn(data)
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

        const properties = _.map(data.properties, (o) => ({
          id: o.id,
          ownershipId: data.id,
          legalLevel: o.legalLevel,
          legalUnit: o.legalUnit,
          suite: o.suite,
          design: o.design,
          size: o.size,
          typeId: o.typeId,
          type: o.type.description,
        }))

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
          people,
          properties,
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
        global.internalApi.getBuildingOwnership(buildingId).then((data) => {
          const newOwnershipProperties = _.map(
            data,
            ({ id: value, suite, type: { description } }) => ({
              value,
              display: `Suite ${suite}: ${description.toLowerCase()}`,
            })
          )

          setOwnershipProperties(newOwnershipProperties)
        })
      )
  }

  const handleSearchChange = (unit) => {
    if (Boolean(unit)) {
      getOwnershipByNumber(unit)

      setShowSuite(true)
    } else setShowSuite(false)
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

  const handleOwnershipUnitDelete = (selection) =>
    Boolean(selection.length)
      ? selection.forEach((propId) =>
          global.internalApi
            .deleteOwnershipUnit(
              propId,
              ownership.properties.find(({ id }) => id === unitId).ownershipId
            )
            .then(() => {
              getOwnershipById(unitId)
            })
        )
      : handleError("Nothing selected!")

  const handleOwnershipSave = () =>
    Boolean(ownership.id)
      ? global.internalApi.updateOwnership(ownership).then(() => {
          getOwnershipById(unitId)
        })
      : handleError("Can't parse ownership id!")

  const handleTransfer = () => {
    handleClose()

    if (ownership.id > 0)
      global.internalApi.transferOwnership(ownership.id).then(() => {
        getOwnershipById(unitId)
      })
  }

  const handleDatePickerChange_active = (value) =>
    setOwnership((ownership) => ({
      ...ownership,
      activateDate: moment(value).toDate(),
    }))

  const handleDatePickerChange_inactive = (value) =>
    setOwnership((ownership) => ({
      ...ownership,
      inactivateDate: moment(value).toDate(),
    }))

  const handleSelectChange = (value) =>
    setOwnership((ownership) => ({ ...ownership, typeId: value }))

  const handleNotesChange = (newNotes) =>
    setOwnership((ownership) => ({
      ...ownership,
      notes: newNotes,
    }))

  const tabContent = {
    prop: (
      <Fragment>
        <Grid item xs={12}>
          <EntityCrudSummaryCard
            searchHintText="Property type"
            searchType="ownership"
            entityName="Property"
            NewEntityLable="Parking\Locker"
            icon={HouseRounded}
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
            entities={ownership.properties}
            emptyEntity={emptyProperty}
            // disableEdit={true}
            onEntityAdd={handleOwnershipUnitSave}
            onEntitiesDelete={handleOwnershipUnitDelete}
          />
        </Grid>
        <Grid item xs={7}>
          <Card>
            <CardHeader
              title={<CardTilte text="Ownership detail" icon={PeopleRounded} />}
            />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item container xs={5}>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <Grid item xs={12} style={{ marginBottom: spacings.large }}>
                      <KeyboardDatePicker
                        autoOk
                        variant="inline"
                        inputVariant="outlined"
                        value={ownership.activateDate}
                        onChange={handleDatePickerChange_active}
                        label="Activate Date"
                        placeholder="dd/MM/yyyy"
                        format="DD/MM/yyyy"
                        InputAdornmentProps={{ position: "start" }}
                        TextFieldComponent={TextFieldUI}
                      />
                    </Grid>
                    <Grid item xs={12} style={{ marginBottom: spacings.large }}>
                      <KeyboardDatePicker
                        autoOk
                        variant="inline"
                        inputVariant="outlined"
                        value={ownership.inactivateDate}
                        onChange={handleDatePickerChange_inactive}
                        label="Inactivate Date"
                        placeholder="dd/MM/yyyy"
                        format="DD/MM/yyyy"
                        InputAdornmentProps={{ position: "start" }}
                        TextFieldComponent={TextFieldUI}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  <Grid item xs={12}>
                    <EntityCrudSelectField
                      label="Type"
                      value={ownership.typeId}
                      optionValues={ownershipTypes}
                      handleChange={handleSelectChange}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={7}>
                  <TextFieldUI
                    multiline
                    rows={5}
                    label="Notes"
                    value={ownership.notes}
                    onChange={handleNotesChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button label="Transfer" color="default" onClick={handleOpen}>
                Transfer
              </Button>
              <Button label="Save" onClick={handleOwnershipSave}>
                Save
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Fragment>
    ),
    dir: (
      <Grid item xs={12}>
        <EntityCrudSummaryCard
          searchHintText="First / last name"
          searchType="people"
          entityName="People"
          NewEntityLable="Person"
          icon={PeopleRounded}
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
            {
              label: "salutation",
              name: "salutation",
              type: "text",
            },
            {
              label: "first name",
              name: "firstName",
              type: "text",
            },
            {
              label: "middle name",
              name: "middleName",
              type: "text",
            },
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
            {
              label: "home Phone",
              name: "homePhone",
              type: "text",
            },
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
    ),
  }

  return (
    <PageContainer>
      <Grid
        item
        container
        xs={12}
        justify={showSuite ? "space-between" : "flex-end"}
        alignItems={showSuite ? "center" : "flex-start"}
        style={{
          margin: spacings.xSmall,
          ...(showSuite
            ? { backgroundColor: colors.white, borderRadius: radii.border }
            : {}),
        }}
      >
        {showSuite && (
          <Grid item xs={3}>
            <h1
              style={{
                margin: 0,
                paddingLeft: spacings.xLarge,
                display: "flex",
                alignItems: "flex-end",
                fontSize: 36,
              }}
            >
              Suite {unitNumber}
            </h1>
          </Grid>
        )}

        <Grid
          item
          xs={3}
          style={{
            minWidth: 150,
            marginBottom: showSuite ? 0 : spacings.xxLarge,
          }}
        >
          <AutoCompleteSearch
            fainted={showSuite}
            addressOptions={addressOptions}
            handleAddressUpdate={handleSearchChange}
            hintText="Suite number"
          />
        </Grid>

        {showSuite && (
          <Grid item xs={6} container justify="center" alignItems="center">
            <Grid item style={{ marginRight: spacings.xSmall }}>
              <TabLink to="/ownership/prop">
                Ownership detail / Property
              </TabLink>
            </Grid>
            <Grid item>
              <TabLink to="/ownership/dir">Directory Entries</TabLink>
            </Grid>
          </Grid>
        )}

        {!showSuite && (
          <Grid item xs={12}>
            <span style={{ fontSize: 24 }}>
              Please select <strong>a suite</strong>
            </span>
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

      {showSuite && tabContent[currentTab]}

      <Dialog modal open={open} onClose={handleClose}>
        <DialogTitle>Transfer Ownership</DialogTitle>
        <DialogContent>
          This will transfer the current ownership. Continue?
        </DialogContent>
        <DialogActions>
          <Button
            style={{ padding: `${spacings.xxSmall} ${spacings.small}` }}
            label="Cancel"
            color="default"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            style={{ padding: `${spacings.xxSmall} ${spacings.small}` }}
            label="Submit"
            disabled={false}
            onClick={handleTransfer}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  )
})
