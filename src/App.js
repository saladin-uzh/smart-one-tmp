import React from "react"
import { connect } from "react-redux"
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom"
import { CognitoState, NewPasswordRequired, PasswordReset } from "react-cognito"

import {
  BuildingConfig,
  Ownership,
  Directory,
  Notifications,
  SidebarNav,
  ChangePasswordForm,
  NewPasswordForm,
  LoginAndReset,
} from "./components"

import { rememberMeAction } from "./store/login"

import GlobalStylesProvider from "./AppStyles"

const loginPage = ({ userLogin, dispatch, rememberMe }) => {
  if (userLogin) dispatch(rememberMeAction.setlogin)

  return <LoginAndReset rememberMe={rememberMe} dispatch={dispatch} />
}

const newPasswordPage = () => (
  <NewPasswordRequired>
    <NewPasswordForm />
  </NewPasswordRequired>
)

const mainPage = ({ dispatch }) => (
  <Router>
    <div style={{ display: "flex", width: "100%", minHeight: "100%" }}>
      <SidebarNav />
      <Switch>
        <Redirect exact from="/" to="/directory" key="zCgA74SIB" />
        <Redirect
          exact
          from="/ownership"
          to="/ownership/prop"
          key="sxipPB-_h"
        />

        <Route
          exact
          path="/notifications"
          component={Notifications}
          key="2oL0oXDHj"
        />

        <Route exact path="/directory" component={Directory} key="RzolOPipG" />

        <Route
          exact
          path="/building-config"
          component={BuildingConfig}
          key="NVbTlV54J"
        />

        <Route path="/ownership/:tab" component={Ownership} key="PEKIP7dfZ" />

        <Route path="/change-password" key="oyQyDOVSA">
          <PasswordReset>
            <ChangePasswordForm dispatch={dispatch} />
          </PasswordReset>
        </Route>

        <Route>
          <Redirect to="/" key="oyHoAjSpm" />
        </Route>
      </Switch>
    </div>
  </Router>
)

const App = (props) => {
  const getPage = () => {
    const { state, userLogin, rememberMe, changePass } = props

    // return mainPage(props)

    switch (state) {
      case CognitoState.AUTHENTICATED:
        return mainPage(props)
      case CognitoState.LOGGING_IN:
      case CognitoState.LOGGED_IN:
        if (userLogin || rememberMe || changePass) return mainPage(props)
        return loginPage(props)
      case CognitoState.NEW_PASSWORD_REQUIRED:
        return newPasswordPage()
      default:
        return loginPage(props)
    }
  }

  return <GlobalStylesProvider>{getPage()}</GlobalStylesProvider>
}

const mapStateToProps = ({ cognito, login }) => ({
  state: cognito.state,
  user: cognito,
  attributes: cognito.attributes,
  rememberMe: login.rememberMe,
  userLogin: login.userLogin,
  changePass: login.changePass,
})

export default connect(mapStateToProps, null)(App)
