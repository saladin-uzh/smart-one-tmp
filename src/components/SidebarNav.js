import React from "react"
import { Link } from "react-router-dom"
import { Logout } from "react-cognito"

import { Grid, Divider } from "@material-ui/core"
import {
  HomeRounded,
  PersonRounded,
  BusinessRounded,
  VpnKeyRounded,
  NotificationsRounded,
  ExitToAppRounded,
} from "@material-ui/icons"

import smart1 from "../assets/ONElogo_ns.png"

import { rememberMeAction } from "../store/login"

import { colors, spacings } from "../constants"

import { SideBarLink } from "../ui"

export default ({ dispatch }) => {
  const onChangePass = () => dispatch(rememberMeAction.setChangePass(true))

  return (
    <Grid
      container
      alignContent="flex-start"
      alignItems="center"
      justify="center"
      spacing={4}
      style={{
        width: 250,
        minWidth: 250,
        height: "100%",
        margin: 0,
        backgroundColor: colors.white,
      }}
    >
      <Grid item xs={12}>
        <Link to="/">
          <img
            src={smart1}
            style={{ width: "40px", marginTop: spacings.xxLarge }}
            alt="SmartOne"
          />
        </Link>
      </Grid>
      <Grid item container xs={12} spacing={1} style={{ paddingLeft: 0 }}>
        <Grid item xs={12}>
          <SideBarLink to="/directory">
            <HomeRounded style={{ marginRight: spacings.small }} />
            Suite Information
          </SideBarLink>
        </Grid>
        <Grid item xs={12}>
          <SideBarLink to="/notifications">
            <NotificationsRounded style={{ marginRight: spacings.small }} />
            Notifications
          </SideBarLink>
        </Grid>
        <Grid item xs={12}>
          <SideBarLink to="/ownership">
            <PersonRounded style={{ marginRight: spacings.small }} />
            Ownership
          </SideBarLink>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Divider style={{ color: colors.main }} />
      </Grid>
      <Grid item container xs={12} spacing={1} style={{ paddingLeft: 0 }}>
        <Grid item xs={12}>
          <SideBarLink to="/community">
            <BusinessRounded style={{ marginRight: spacings.small }} />
            Building Configuration
          </SideBarLink>
        </Grid>
        <Grid item xs={12}>
          <SideBarLink to="/change-password" onClick={onChangePass}>
            <VpnKeyRounded style={{ marginRight: spacings.small }} />
            Change Password
          </SideBarLink>
        </Grid>
        <Grid item xs={12}>
          <Logout>
            <SideBarLink exact to="/">
              <ExitToAppRounded style={{ marginRight: spacings.small }} />
              Log Out
            </SideBarLink>
          </Logout>
        </Grid>
      </Grid>
    </Grid>
  )
}
