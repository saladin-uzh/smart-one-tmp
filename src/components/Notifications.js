import _ from "lodash"
import React, { useState, useEffect } from "react"
import moment from "moment"

import { Grid, Card, CardHeader, CardContent } from "@material-ui/core"

import { MessageList, ComposeMessageDialog } from "."

export default () => {
  const [messages, setMessages] = useState([])
  const [addressOptions, setAddressOptions] = useState({})

  useEffect(() => {
    getNotifications()
    getUnits()
  }, [])

  const getUnits = () => {
    global.internalApi.getBuildingUnits(global.buildingId).then((data) => {
      const units = data
      let options = { "All suites": _.map(units, "suite") }

      const suiteOptions = _.fromPairs(
        _.map(_.sortBy(units, ["suite"]), ({ suite }) => [
          `Suite ${suite}`,
          [suite],
        ])
      )

      const tags = _.reduce(
        _.flatMap(units, ({ tags, suite: unit }) =>
          _.map(tags, ({ tag }) => ({ tag, unit }))
        ),
        (result, { tag, unit }) => {
          if (result[tag] || (result[tag] = [])) result[tag].push(unit)
          return result
        },
        {}
      )

      options = _.merge(options, suiteOptions, tags)

      console.log("options", options)

      setAddressOptions(options)
    })
  }

  const getNotifications = () => {
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
              _.map(m_house, ({ House }) => House.split("-")[1])
            )

            const displayAddressees =
              m_house.length > 4
                ? `${allAddressees[0]}, ${allAddressees[1]}, ${
                    allAddressees[2]
                  } and ${allAddressees.length - 3} others`
                : _.sum(_.map(allAddressees, (a) => a + " "))

            const parser = new DOMParser()

            return {
              id,
              subject: parser.parseFromString(
                "<!doctype html><body>" + m_subject,
                "text/html"
              ).body.textContent,
              type,
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

        setMessages(notifications)
      })
  }

  const handleMessageSend = (buildingId, toAddr, msgSubject, msgMessage) => {
    console.log("sending message to ", toAddr)

    global.externalApi
      .sendNotification(buildingId, toAddr, msgSubject, msgMessage)
      .then(() => {
        getNotifications()
      })
  }

  const handleMessageDelete = ({ id }) => {
    global.externalApi.deleteNotification(id).then(() => {
      getNotifications()
    })
  }

  return (
    <div>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Card style={{ margin: "20px" }}>
            <CardHeader></CardHeader>
            <CardContent>
              <MessageList
                messages={messages}
                onDelete={handleMessageDelete}
              ></MessageList>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ComposeMessageDialog
        buildingId={global.buildingNum}
        onSend={handleMessageSend}
        addressOptions={addressOptions}
      />
    </div>
  )
}
