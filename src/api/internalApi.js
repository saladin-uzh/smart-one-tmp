/**
 * Created by bryan on 11/24/17.
 */

// import _ from "lodash"

class InternalApiService {
  constructor(endpoint) {
    this.endpoint = endpoint
    this.units = ["101", "102", "103"]
  }

  resolveAddressString(addressString) {}

  getOccupants(buildingId) {
    const request = `https://${this.endpoint}/api/PropertyOccupants/Building/${buildingId}`
    return new Promise((resolve, reject) => {
      fetch(request)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          resolve(json)
        })
    })
  }

  getBuildingUnits(buildingId) {
    const request = `https://${this.endpoint}/api/properties/Building/${buildingId}`
    return new Promise((resolve, reject) => {
      fetch(request)
        .then((response) => {
          const j = response.json()
          console.log("building units json response", j)
          return j
        })
        .then((json) => {
          resolve(json)
        })
    })
  }

  getUnit(unitId) {
    const request = `https://${this.endpoint}/api/properties/${unitId}`
    return new Promise((resolve, reject) => {
      fetch(request)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          resolve(json)
        })
    })
  }

  updateOccupant(occupant) {
    const data = {
      id: occupant.id,
      Phone: occupant.phone,
      Email: occupant.email,
      FirstName: occupant.firstName,
      LastName: occupant.lastName,
      LobbyPhoneName: "",
      MiddleName: "",
      Salutation: "",
      PropertyId: occupant.unitId,
    }

    const request = `https://${this.endpoint}/api/PropertyOccupants/${occupant.id}`
    return fetch(request, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      return response
    })
  }

  addOccupant(occupant) {
    const data = {
      Phone: occupant.phone,
      Email: occupant.email,
      FirstName: occupant.firstName,
      LastName: occupant.lastName,
      LobbyPhoneName: "",
      MiddleName: "",
      Salutation: "",
      PropertyId: occupant.unitId,
    }

    const request = `https://${this.endpoint}/api/PropertyOccupants`
    return new Promise((resolve, reject) => {
      fetch(request, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          resolve(json)
        })
    })
  }

  deleteOccupants(occupantId) {
    const request = `https://${this.endpoint}/api/PropertyOccupants/${occupantId}`
    return fetch(request, {
      method: "DELETE",
    }).then((response) => {
      return response
    })
  }

  saveTag(tag) {
    const request = `https://${this.endpoint}/api/PropertyTags`
    return new Promise((resolve, reject) => {
      fetch(request, {
        method: "POST",
        body: JSON.stringify(tag),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          resolve(json)
        })
    })
  }

  getExistBuildingTags(buildingId) {
    const request = `https://${this.endpoint}/api/propertytags/name/building/${buildingId}`
    return new Promise((resolve, reject) => {
      fetch(request)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          resolve(json)
        })
    })
  }

  deleteTag(tag) {
    const request = `https://${this.endpoint}/api/PropertyTags/${tag.id}`
    return fetch(request, {
      method: "DELETE",
    }).then((response) => {
      return response
    })
  }

  getBuildingOwnership(buildingId) {
    const request = `https://${this.endpoint}/api/properties/Building/${buildingId}`
    return new Promise((resolve, reject) => {
      fetch(request)
        .then((response) => {
          const j = response.json()
          console.log("building ownership json response", j)
          return j
        })
        .then((json) => {
          resolve(json)
        })
    })
  }

  getOwnershipByUnit(unitId) {
    const request = `https://${this.endpoint}/api/ownerships/Property/${unitId}`
    return new Promise((resolve, reject) => {
      fetch(request)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          resolve(json)
        })
    })
  }

  getOwnershipTypes() {
    const request = `https://${this.endpoint}/api/OwnershipTypes`
    return new Promise((resolve, reject) => {
      fetch(request)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          resolve(json)
        })
    })
  }

  getOwnershipPersonTypes() {
    const request = `https://${this.endpoint}/api/OwnershipPersonTypes`
    return new Promise((resolve, reject) => {
      fetch(request)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          resolve(json)
        })
    })
  }

  updateOwnershipPerson(person) {
    const data = {
      id: person.id,
      salutation: person.salutation,
      firstName: person.firstName,
      middleName: person.middleName,
      lastName: person.lastName,
      address: person.address,
      suite: person.suite,
      city: person.city,
      province: person.province,
      postcodeZip: person.postcodeZip,
      country: person.country,
      email: person.email,
      homePhone: person.homePhone,
      cellPhone: person.cellPhone,
      workPhone: person.workPhone,
      typeId: person.typeId,
      ownershipId: person.ownershipId,
    }

    const request = `https://${this.endpoint}/api/OwnershipPerson/${person.id}`
    return fetch(request, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      return response
    })
  }

  addOwnershipPerson(person) {
    const data = {
      salutation: person.salutation,
      firstName: person.firstName,
      middleName: person.middleName,
      lastName: person.lastName,
      address: person.address,
      suite: person.suite,
      city: person.city,
      province: person.province,
      postalcodeZip: person.postalcodeZip,
      country: person.country,
      email: person.email,
      homePhone: person.homePhone,
      cellPhone: person.cellPhone,
      workPhone: person.workPhone,
      typeId: person.typeId,
      ownershipId: person.ownershipId,
    }

    const request = `https://${this.endpoint}/api/OwnershipPerson`
    return new Promise((resolve, reject) => {
      fetch(request, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          resolve(json)
        })
    })
  }

  deleteOwnershipPerson(personId) {
    const request = `https://${this.endpoint}/api/OwnershipPerson/${personId}`
    return fetch(request, {
      method: "DELETE",
    }).then((response) => {
      return response
    })
  }

  getBuildingOwnershipUnits(buildingId) {
    const request = `https://${this.endpoint}/api/properties/building/${buildingId}/NoOwnership`
    return new Promise((resolve, reject) => {
      fetch(request)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          resolve(json)
        })
    })
  }

  addOwnershipUnit(propertyId, ownershipId) {
    const request = `https://${this.endpoint}/api/Ownerships/${ownershipId}/Property/${propertyId}`
    return fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      return response
    })
  }

  deleteOwnershipUnit(propertyId, ownershipId) {
    const request = `https://${this.endpoint}/api/Ownerships/${ownershipId}/Property/${propertyId}`
    return fetch(request, {
      method: "DELETE",
    }).then((response) => {
      return response
    })
  }

  updateOwnership(ownership) {
    const data = {
      id: ownership.id,
      activateDate: ownership.activateDate
        ? ownership.activateDate.toISOString()
        : "0001-01-01T00:00:00+00:00",
      inActivateDate: ownership.inactivateDate
        ? ownership.inactivateDate.toISOString()
        : "0001-01-01T00:00:00+00:00",
      notes: ownership.notes,
      typeId: ownership.typeId,
      active: ownership.active,
    }

    const request = `https://${this.endpoint}/api/Ownerships/${ownership.id}`
    return fetch(request, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      return response
    })
  }

  transferOwnership(ownershipId) {
    const request = `https://${this.endpoint}/api/Ownerships/transfer/${ownershipId}`
    return fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      return response
    })
  }
}

export default InternalApiService
