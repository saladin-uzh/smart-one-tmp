import _ from "lodash"
import React, { useState, useEffect, useCallback } from "react"
import moment from "moment"

import { Grid } from "@material-ui/core"

import { MessageList, ComposeMessageDialog } from "."
import { PageContainer } from "../ui"
import withErrorHandling from "../utils/withErrorHandling"

export default withErrorHandling(({ handleError }) => {
  const [messages, setMessages] = useState([])
  const [addressOptions, setAddressOptions] = useState([])

  const getUnits = useCallback(() => {
    global.internalApi.getBuildingUnits(global.buildingId).then(
      (data) => {
        const units = _.map(data, ({ id, commaxId: number }) => ({
          id,
          number,
        }))

        let options = _.map(_.sortBy(units, ["number"]), ({ number }) =>
          number.trim()
        )

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
      },
      ({ message }) => handleError(message)
    )
  }, [handleError])

  const getNotifications = useCallback(() => {
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
              _.map(m_house, ({ House }) => House.split("-")[1])
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

        console.log("notifs: ", notifications)

        setMessages(notifications)
      },
      ({ message }) => handleError(message)
    )
  }, [handleError])

  useEffect(() => {
    getNotifications()
    getUnits()
  }, [getNotifications, getUnits])

  const handleMessageSend = (buildingId, toAddr, msgSubject, msgMessage) => {
    console.log("sending message to ", toAddr)

    global.externalApi
      .sendNotification(buildingId, toAddr, msgSubject, msgMessage)
      .then(
        () => {
          getNotifications()
        },
        ({ message }) => handleError(message)
      )
  }

  const handleMessageDelete = ({ id }) => {
    global.externalApi.deleteNotification(id).then(
      () => {
        getNotifications()
      },
      ({ message }) => handleError(message)
    )
  }

  return (
    <PageContainer>
      <Grid item container xs={10}>
        <Grid item xs={12}>
          <MessageList onDelete={handleMessageDelete} messages={messages} />
        </Grid>
      </Grid>
      <Grid item xs={2}>
        <ComposeMessageDialog
          buildingId={global.buildingNum}
          onSend={handleMessageSend}
          addressOptions={addressOptions}
          handleError={handleError}
        />
      </Grid>
    </PageContainer>
  )
})
