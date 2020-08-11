import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { CognitoState, NewPasswordRequired } from 'react-cognito'

import './styles/App.css'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// import Divider from 'material-ui/Divider'
// import Paper from 'material-ui/Paper'
// import SelectField from 'material-ui/SelectField'
// import MenuItem from 'material-ui/MenuItem'
// import {
//   Table,
//   TableBody,
//   TableHeader,
//   TableHeaderColumn,
//   TableRow,
//   TableRowColumn,
// } from 'material-ui/Table'
// import { Checkbox } from 'material-ui'

import headerImage from './assets/1920-header.png'

import { rememberMeAction } from './store/login'

import {
  CommunityConfiguration,
  Ownership,
  Directory,
  Notifications,
  SidebarNav,
  ChangePasswordForm,
  NewPasswordForm,
  LoginAndReset,
} from './components'

//const App = ({state, user, attrs}) => {
//  switch (state)
//  render() {
//
//    switch()
//    return (
//    );
//  }
//}

// const AppBase = ({state, user, attrs}) => {
//   switch (state) {
//     case CognitoState.LOGGING_IN:
//     case CognitoState.LOGGED_IN:
//       return mainPage();
//     case CognitoState.NEW_PASSWORD_REQUIRED:
//       return newPasswordPage();
//     default:
//       return loginPage();
//   }
// }

const loginPage = ({ userLogin, dispatch, rememberMe }) => {
  if (userLogin) dispatch(rememberMeAction.setlogin)

  return <LoginAndReset {...{ rememberMe, dispatch }}></LoginAndReset>
}

const newPasswordPage = () => (
  <NewPasswordRequired>
    <NewPasswordForm />
  </NewPasswordRequired>
)

const сhangePasswordPage = (props) => <ChangePasswordForm {...props} />

const mainPage = ({ dispatch }) => (
  <Router>
    <MuiThemeProvider>
      <div className="App" style={{ width: '1900px' }}>
        <SidebarNav dispatch={dispatch}></SidebarNav>
        <div>
          <header className="App-header">
            <div
              style={{ width: '1900px', height: '120px', overflow: 'hidden' }}
            >
              <img src={headerImage} alt="logo" style={{ opacity: '0.33' }} />
            </div>

            <div
              style={{
                position: 'absolute',
                top: '3%',
                width: '100%',
                textAlign: 'center',
                color: 'rgba(36, 52, 58, 0.95)',
                fontSize: '4em',
              }}
            >
              <Route
                key={0}
                path={'/'}
                exact={true}
                component={() => <span>Home</span>}
              />
              <Route
                key={1}
                path={'/notifications'}
                exact={true}
                component={() => <span>Notifications</span>}
              />
              <Route
                key={2}
                path={'/directory'}
                exact={true}
                component={() => <span>Suite Information</span>}
              />
              <Route
                key={3}
                path={'/community'}
                exact={true}
                component={() => <span>Building Configuration</span>}
              />
              <Route
                key={4}
                path={'/ownership'}
                exact={true}
                component={() => <span>Ownership</span>}
              />
            </div>
          </header>
          <div style={{ height: '700px' }}>
            <Route
              key={0}
              path={'/'}
              exact={true}
              component={Directory}
            ></Route>

            <Route
              key={1}
              path={'/notifications'}
              exact={true}
              component={Notifications}
            ></Route>

            <Route
              key={2}
              path={'/directory'}
              exact={true}
              component={Directory}
            ></Route>

            <Route
              key={3}
              path={'/community'}
              exact={true}
              component={CommunityConfiguration}
            ></Route>

            <Route
              key={4}
              path={'/ownership'}
              exact={true}
              component={Ownership}
            ></Route>
          </div>
        </div>
      </div>
    </MuiThemeProvider>
  </Router>
)

class AppBase extends Component {
  // constructor(props) {
  //   super(props)
  // }

  render() {
    switch (this.props.state) {
      // case CognitoState.AUTHENTICATED:
      // case CognitoState.LOGGING_IN:
      case CognitoState.LOGGED_IN:
        if (this.props.userLogin || this.props.rememberMe) {
          if (this.props.changePass) return сhangePasswordPage(this.props)
          else return mainPage(this.props)
        } else {
          return loginPage(this.props)
        }
      case CognitoState.NEW_PASSWORD_REQUIRED:
        return newPasswordPage()
      default:
        return loginPage(this.props)
    }
  }
}

const mapStateToProps = ({ cognito, login }) => ({
  state: cognito.state,
  user: cognito,
  attributes: cognito.attributes,
  rememberMe: login.rememberMe,
  userLogin: login.userLogin,
  changePass: login.changePass,
})

const App = connect(mapStateToProps, null)(AppBase)

export default App
