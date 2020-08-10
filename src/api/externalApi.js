/**
 * Created by bryan on 11/24/17.
 */

import _ from 'lodash'
import moment from 'moment'

class ExternalApiService {
  constructor(endpoint, internalApiService) {
    this.endpoint = endpoint
    this.internalApiService = internalApiService
  }

  getBuildingNotifications(buildingId) {
    const request = `https://${this.endpoint}/postform/RetrieveNotice`
    const building = JSON.stringify([{ Bld: `${buildingId}` }])
    return new Promise((resolve /**, reject*/) => {
      let formData = new FormData()
      formData.append('m_type', 'Bld')
      formData.append('m_dong', building)
      const startDate = moment().add(-6, 'months').format('YYYYMMDDHHmm')
      formData.append('m_startdate', startDate)
      fetch(request, { method: 'POST', body: formData })
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          //console.log('notifications', json.data)
          resolve(json.data)
        })
    })
  }

  getSuiteNotifications(buildingId, unitId) {
    const request = `https://${this.endpoint}/postform/RetrieveNotice`
    const Suite = JSON.stringify([{ House: `${buildingId}-${unitId}` }])
    return new Promise((resolve /**, reject*/) => {
      let formData = new FormData()
      formData.append('m_type', 'House')
      formData.append('m_ho', Suite)
      const startDate = moment().add(-3, 'months').format('YYYYMMDDHHmm')
      formData.append('m_startdate', startDate)
      fetch(request, { method: 'POST', body: formData })
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          //console.log('notifications', json.data)
          resolve(json.data)
        })
    })
  }

  deleteNotification(id) {
    const request = `https://${this.endpoint}/postform/DeleteNotice`
    return new Promise((resolve /**, reject*/) => {
      let formData = new FormData()
      formData.append('m_no', id)
      fetch(request, { method: 'POST', body: formData })
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          //console.log('notifications', json.data)
          resolve(json.data)
        })
    })
  }

  sendNotification(buildingId, unitIds, subject, message) {
    //const toAddresses = this.internalApiService.resolveAddressString(to);
    console.log('sending message', buildingId, unitIds, subject, message)
    const request = `https://${this.endpoint}/postform/AddNotice`
    const unitAddr = JSON.stringify(
      _.map(unitIds, (u) => {
        return {
          House: `${buildingId}-${u}`,
        }
      })
    )
    const currentDate = moment().format('YYYYMMDDHHmm')
    const expiryDate = moment().add(1, 'weeks').format('YYYYMMDDHHmm')
    var formData = new FormData()
    formData.append('m_ho', unitAddr)
    formData.append('m_type', 'House')
    formData.append('m_author', 'admin')
    formData.append('m_subject', subject)
    formData.append('m_content', message)
    formData.append('m_sdate', currentDate)
    formData.append('m_edate', expiryDate)

    return new Promise((resolve /**, reject*/) => {
      fetch(request, { method: 'POST', body: formData })
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          //console.log('send message api response',json.data)
          resolve(json.data)
        })
    })
  }

  getDirectoryEntry(buildingId, unitId) {
    const request = `https://${this.endpoint}/get/RetrieveName?m_dong=${buildingId}&m_ho=${unitId}`
    console.log(request)

    return new Promise((resolve /**, reject*/) => {
      fetch(request)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          resolve(json.data)
        })
    })
  }

  getAllDirectoryEntry() {
    const request = `https://${this.endpoint}/get/RetrieveAllName`
    console.log(request)

    return new Promise((resolve /**, reject*/) => {
      fetch(request)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          console.log('directory entries', json.data)
          resolve(json.data)
        })
    })
  }

  setDirectoryEntry(buildingId, unitId, name) {
    const request = `https://${this.endpoint}/postform/UpdateName`
    var formData = new FormData()
    formData.append('m_dong', buildingId)
    formData.append('m_ho', unitId)
    formData.append('m_username', name)

    return new Promise((resolve /**, reject*/) => {
      fetch(request, { method: 'POST', body: formData })
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          resolve(json.data)
        })
    })
  }

  addDirectoryEntry(buildingId, unitId, name) {
    const request = `https://${this.endpoint}/postform/AddName`
    var formData = new FormData()
    formData.append('m_dong', buildingId)
    formData.append('m_ho', unitId)
    formData.append('m_username', name)

    return new Promise((resolve /**, reject*/) => {
      fetch(request, { method: 'POST', body: formData })
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          resolve(json.data)
        })
    })
  }

  deleteDirectoryEntry(buildingId, unitId, name) {
    const request = `https://${this.endpoint}/postform/DeleteName`
    var formData = new FormData()
    formData.append('m_dong', buildingId)
    formData.append('m_ho', unitId)
    formData.append('m_username', name)

    return new Promise((resolve /**, reject*/) => {
      fetch(request, { method: 'POST', body: formData })
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          resolve(json.data)
        })
    })
  }
}

export default ExternalApiService
