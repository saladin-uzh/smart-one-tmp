import React from "react"
import { connect } from "react-redux"
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom"
import { CognitoState, NewPasswordRequired } from "react-cognito"

import {
  CommunityConfiguration,
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

const changePasswordPage = (props) => <ChangePasswordForm {...props} />

const mainPage = ({ dispatch }) => (
  <Router>
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <SidebarNav dispatch={dispatch} />
      <Switch>
        <Redirect exact from="/" to="/directory" key="zCgA74SIB" />

        <Route
          path="/notifications"
          component={Notifications}
          key="2oL0oXDHj"
        />

        <Route path="/directory" component={Directory} key="RzolOPipG" />

        <Route
          path="/community"
          component={CommunityConfiguration}
          key="NVbTlV54J"
        />

        <Route path="/ownership" component={Ownership} key="PEKIP7dfZ" />
      </Switch>
    </div>
  </Router>
)

const App = (props) => {
  const getPage = () => {
    // const { state, userLogin, rememberMe, changePass } = props

    return mainPage(props)

    // switch (state) {
    //   case CognitoState.AUTHENTICATED:
    //   case CognitoState.LOGGING_IN:
    //   case CognitoState.LOGGED_IN:
    //     if (userLogin || rememberMe) {
    //       if (changePass) return changePasswordPage(props)
    //       else return mainPage(props)
    //     } else return loginPage(props)
    //   case CognitoState.NEW_PASSWORD_REQUIRED:
    //     return newPasswordPage()
    //   default:
    //     return loginPage(props)
    // }
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
