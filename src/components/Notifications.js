import _ from 'lodash'
import React, { Component } from 'react'
import moment from 'moment'

import { Grid, Card, CardHeader, CardContent } from '@material-ui/core'

import { MessageList, ComposeMessageDialog } from '.'

export default class Notifications extends Component {
  constructor(props) {
    super(props)
    this.getNotifications = this.getNotifications.bind(this)
    this.handleMessageSend = this.handleMessageSend.bind(this)
    this.handleMessageDelete = this.handleMessageDelete.bind(this)
    this.getUnits = this.getUnits.bind(this)
    this.state = {
      messages: [],
    }
    this.getNotifications()
    this.getUnits()
  }

  getUnits() {
    const component = this
    global.internalApi
      .getBuildingUnits(global.buildingId)
      .then(function (data) {
        const units = data
        let options = { 'All suites': _.map(units, 'suite') }
        const suiteOptions = _.fromPairs(
          _.map(_.sortBy(units, ['suite']), (unit) => {
            return [`Suite ${unit.suite}`, [unit.suite]]
          })
        )
        const tags = _.reduce(
          _.flatMap(units, (unit) => {
            return _.map(unit.tags, (tag) => {
              return { tag: tag.tag, unit: unit.suite }
            })
          }),
          (result, tag) => {
            if (result[tag.tag] || (result[tag.tag] = []))
              result[tag.tag].push(tag.unit)
            return result
          },
          {}
        )
        _.merge(options, suiteOptions, tags)
        console.log('options', options)
        component.setState({ addressOptions: options })
      })
  }

  getNotifications() {
    const component = this
    global.externalApi
      .getBuildingNotifications(global.buildingNum)
      .then((data) => {
        const notifications = _.map(data, (msg) => {
          const allAddressees = _.uniq(
            _.map(msg.m_house, (addr) => {
              return addr.House.split('-')[1]
            })
          )
          const displayAddressees =
            msg.m_house.length > 4
              ? `${allAddressees[0]}, ${allAddressees[1]}, ${
                  allAddressees[2]
                } and ${allAddressees.length - 3} others`
              : _.sum(
                  _.map(allAddressees, (a) => {
                    return a + ' '
                  })
                )
          var parser = new DOMParser()
          return {
            id: msg.m_no,
            subject: parser.parseFromString(
              '<!doctype html><body>' + msg.m_subject,
              'text/html'
            ).body.textContent,
            type: msg.m_type,
            message: parser.parseFromString(
              '<!doctype html><body>' + msg.m_content,
              'text/html'
            ).body.textContent,
            allSentTo: allAddressees,
            sentTo: displayAddressees,
            sendDate: moment(msg.m_wdate, 'YYYYMMDDHHmm').unix(),
            expires: moment(msg.m_edate, 'YYYYMMDDHHmm').unix(),
          }
        })
        component.setState({ messages: notifications })
      })
  }

  handleMessageSend(buildingId, toAddr, msgSubject, msgMessage) {
    console.log('sending message to ', toAddr)
    global.externalApi
      .sendNotification(buildingId, toAddr, msgSubject, msgMessage)
      .then(() => {
        this.getNotifications()
      })
  }

  handleMessageDelete(message) {
    global.externalApi.deleteNotification(message.id).then(() => {
      this.getNotifications()
    })
  }

  showComposeDialog() {
    this.setState({ showCompose: true })
  }

  render() {
    return (
      <div>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Card style={{ margin: '20px' }}>
              <CardHeader></CardHeader>
              <CardContent>
                <MessageList
                  messages={this.state.messages}
                  onDelete={this.handleMessageDelete}
                ></MessageList>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <ComposeMessageDialog
          buildingId={global.buildingNum}
          onSend={this.handleMessageSend}
          addressOptions={this.state.addressOptions}
        />
      </div>
    )
  }
}
