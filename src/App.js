import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText,
} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui-next/Grid';
import Tooltip from 'material-ui-next/Tooltip';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import DatePicker from 'material-ui/DatePicker';
import Chip from 'material-ui/Chip';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import moment from 'moment';
import {
  CognitoState,
  Logout,
  Login,
  NewPasswordRequired,
  PasswordReset,
  EmailVerification,
  Confirm,
  changePassword,
} from 'react-cognito';

import logo from './logo.svg';
import headerImage from './1920-header.png';
import smart1 from './ONElogo_ns.png';
import './App.css';
import {
  AutoCompleteSearch,
  MessageList,
  SearchAutoSuggest,
  ComposeMessageDialog,
  EntityCrudSummaryCard,
  EntityCrudSelectField,
} from './foundation.js';
import { rememberMeAction } from './login';
import { Checkbox } from 'material-ui';

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

class AppBase extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    switch (this.props.state) {
      case CognitoState.AUTHENTICATED:
      case CognitoState.LOGGING_IN:
      case CognitoState.LOGGED_IN:
        if (this.props.userLogin || this.props.rememberMe) {
          if (this.props.changePass) return ChangePassword(this.props);
          else return mainPage(this.props);
        } else {
          return loginPage(this.props);
        }
      case CognitoState.NEW_PASSWORD_REQUIRED:
        return newPasswordPage();
      default:
        return loginPage(this.props);
    }
  }
}

const mapStateToProps = (state) => ({
  state: state.cognito.state,
  user: state.cognito,
  attributes: state.cognito.attributes,
  rememberMe: state.login.rememberMe,
  userLogin: state.login.userLogin,
  changePass: state.login.changePass,
});

const App = connect(mapStateToProps, null)(AppBase);

class LoginAndReset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showReset: false,
    };
  }

  onShowReset = () => {
    this.setState({ showReset: !this.state.showReset });
  };

  render() {
    const component = this;
    const showComponent = component.state.showReset ? (
      <PasswordReset>
        <PasswordResetForm />
      </PasswordReset>
    ) : (
      <Login>
        <LoginForm
          onShowReset={this.onShowReset}
          rememberMe={this.props.rememberMe}
          dispatch={this.props.dispatch}
        />
      </Login>
    );
    return <div>{showComponent}</div>;
  }
}

const loginPage = (props) => {
  if (props.userLogin) props.dispatch(rememberMeAction.setlogin);
  return (
    <LoginAndReset
      rememberMe={props.rememberMe}
      dispatch={props.dispatch}
    ></LoginAndReset>
  );
};

const newPasswordPage = () => {
  return (
    <NewPasswordRequired>
      <NewPasswordForm />
    </NewPasswordRequired>
  );
};

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
      username: props.username,
      password: '',
      rememberMe: props.rememberMe,
    };
  }

  onSubmit = (event) => {
    event.preventDefault();

    this.props.dispatch(rememberMeAction.set(this.state.rememberMe, true));

    this.props.onSubmit(this.state.username, this.state.password);
  };

  changeUsername = (event) => {
    this.setState({ username: event.target.value });
  };

  changePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  changeRememberMe = (event, checked) => {
    this.setState({ rememberMe: checked });
  };

  componentWillUnmount = () => {
    this.props.clearCache();
  };

  render = () => {
    const msg = typeof this.props.error == 'string' ? this.props.error : '';
    return (
      <MuiThemeProvider>
        <form onSubmit={this.onSubmit}>
          <Grid container spacing={16}>
            <Grid item xs={4} />
            <Grid item xs={8}>
              <h1>SmartONE Grandview</h1>
              <h2>Please log in</h2>
              <TextField onChange={this.changeUsername} hintText='Username' />
              <TextField
                onChange={this.changePassword}
                hintText='Password'
                type='password'
                errorText={msg}
                autoComplete='new-password'
              />
              <div style={{ marginTop: '30px' }}>
                <RaisedButton primary type='submit'>
                  Log in
                </RaisedButton>
              </div>
              <div style={{ marginTop: '30px' }}>
                <a href='#' onClick={this.props.onShowReset}>
                  Forgot your password?
                </a>
              </div>
            </Grid>
          </Grid>
        </form>
      </MuiThemeProvider>
    );
  };
}

class NewPasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: props.error,
      password: '',
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.password);
  };

  changePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  render = () => {
    const msg = typeof this.props.error == 'string' ? this.props.error : '';
    return (
      <MuiThemeProvider>
        <form onSubmit={this.onSubmit}>
          <Grid container spacing={16}>
            <Grid item xs={4} />
            <Grid item xs={8}>
              <h1>SmartONE Ten York</h1>
              <h2>Please select a new password for your account:</h2>
              <TextField
                onChange={this.changePassword}
                hintText='Password'
                required
                type='password'
                errorText={msg}
              />
              <div style={{ marginTop: '30px' }}>
                <RaisedButton primary type='submit'>
                  Submit
                </RaisedButton>
              </div>
            </Grid>
          </Grid>
        </form>
      </MuiThemeProvider>
    );
  };
}

class PasswordResetForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      code: '',
      password: '',
      message: '',
      error: '',
      codeSent: false,
      pwdReset: false,
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props
      .setPassword(this.state.username, this.state.code, this.state.password)
      .then(() =>
        this.setState({
          message: 'Password reset',
          error: '',
          pwdReset: true,
        })
      )
      .catch((err) =>
        this.setState({
          message: '',
          error: err.message,
        })
      );
  };

  sendVerificationCode = (event) => {
    event.preventDefault();
    this.props
      .sendVerificationCode(this.state.username)
      .then(() =>
        this.setState({
          message: 'Verification code sent',
          error: '',
          codeSent: true,
        })
      )
      .catch((err) => {
        if (err.code === 'UserNotFoundException') {
          this.setState({ error: 'User not found' });
        } else {
          this.setState({ error: err.message });
        }
      });
  };

  changePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  changeCode = (event) => {
    this.setState({ code: event.target.value });
  };

  changeUsername = (event) => {
    this.setState({ username: event.target.value });
  };

  render = () => {
    const msg = typeof this.props.error == 'string' ? this.props.error : '';
    let verify = null;
    if (this.state.codeSent && !this.state.pwdReset) {
      verify = (
        <div>
          <h4>{this.state.message}</h4>
          <h4>
            Please provide your verification code to select a new password for
            your account:
          </h4>
          <TextField
            onChange={this.changeCode}
            hintText='Verification Code'
            required
          />
          <TextField
            onChange={this.changePassword}
            hintText='New Password'
            required
            type='password'
            errorText={msg}
          />
          <div style={{ marginTop: '30px' }}>
            <RaisedButton primary type='submit'>
              Submit
            </RaisedButton>
          </div>
        </div>
      );
    }

    if (this.state.codeSent && this.state.pwdReset) {
      verify = (
        <div>
          <h4>Your password has been reset.</h4>
          <a href='/'>Login</a>
        </div>
      );
    }

    if (!this.state.codeSent) {
      verify = (
        <div>
          <h4>
            Please provide your username; we&apos;ll email a verification code
            to you
          </h4>
          <TextField
            onChange={this.changeUsername}
            hintText='Username'
            required
            errorText={msg}
          />
          <div style={{ marginTop: '30px' }}>
            <RaisedButton onClick={this.sendVerificationCode} primary>
              Send code
            </RaisedButton>
          </div>
        </div>
      );
    }
    return (
      <MuiThemeProvider>
        <form onSubmit={this.onSubmit}>
          <Grid container spacing={16}>
            <Grid item xs={4} />
            <Grid item xs={8}>
              {verify}
            </Grid>
          </Grid>
        </form>
      </MuiThemeProvider>
    );
  };
}

const ChangePassword = (props) => {
  return (
    <ChangePasswordForm
      user={props.user}
      dispatch={props.dispatch}
      rememberMe={props.rememberMe}
    ></ChangePasswordForm>
  );
};

class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      loginDisplay: 'none',
      formDisplay: 'block',
    };
  }

  onSubmit = (event) => {
    if (this.state.newPassword !== this.state.confirmPassword)
      this.setState({
        error: 'Your new password and confirmation password do not match.',
      });
    else {
      const user = this.props.user.user;
      event.preventDefault();
      changePassword(user, this.state.oldPassword, this.state.newPassword).then(
        () => {
          this.setState({ loginDisplay: 'block', formDisplay: 'none' });
        },
        (error) => this.setState({ error })
      );
    }
  };

  onShowLogin = () => {
    this.props.dispatch(rememberMeAction.set(this.props.rememberMe));
  };

  changeOldPassword = (event) => {
    this.setState({ oldPassword: event.target.value });
  };

  changeNewPassword = (event) => {
    this.setState({ newPassword: event.target.value });
  };

  changeConfirmPassword = (event) => {
    this.setState({ confirmPassword: event.target.value });
  };

  render = () => {
    return (
      <MuiThemeProvider>
        <div style={{ display: this.state.formDisplay }}>
          <form onSubmit={this.onSubmit}>
            <Grid container spacing={16}>
              <Grid item xs={4} />
              <Grid item xs={8}>
                <h1>SmartONE Ten York</h1>
                <h2>Change Password</h2>
                <TextField
                  onChange={this.changeOldPassword}
                  hintText='Old Password'
                  type='password'
                />
                <br />
                <TextField
                  onChange={this.changeNewPassword}
                  hintText='New Password'
                  type='password'
                />
                <TextField
                  onChange={this.changeConfirmPassword}
                  hintText='Confirmation Password'
                  type='password'
                  errorText={this.state.error}
                />
                <div style={{ marginTop: '30px' }}>
                  <RaisedButton primary type='submit'>
                    Change password
                  </RaisedButton>
                </div>
              </Grid>
            </Grid>
          </form>
        </div>
        <div style={{ marginTop: '30px', display: this.state.loginDisplay }}>
          Password changed successfully.{' '}
          <a href='#' onClick={this.onShowLogin}>
            Login
          </a>{' '}
          with new password.
        </div>
      </MuiThemeProvider>
    );
  };
}

const mainPage = (props) => {
  return (
    <Router>
      <MuiThemeProvider>
        <div className='App' style={{ width: '1900px' }}>
          <SidebarNav dispatch={props.dispatch}></SidebarNav>
          <div>
            <header className='App-header'>
              <div
                style={{ width: '1900px', height: '120px', overflow: 'hidden' }}
              >
                <img src={headerImage} alt='logo' style={{ opacity: '0.33' }} />
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
  );
};

const LogoutButton = ({ onClick }) => {
  return (
    <i onClick={onClick} className='menu-item__icon material-icons'>
      exit_to_app
    </i>
  );
};

class SidebarNav extends Component {
  constructor(props) {
    super(props);
  }

  onChangePass = () => {
    this.props.dispatch(rememberMeAction.setChangePass(true));
  };
  render() {
    return (
      <div className='sidebar'>
        <div className='menu-item menu-item--top menu-item--home'>
          <Link className='menu-item__logo active' to='/'>
            <img
              src={smart1}
              style={{ width: '40px', marginTop: '4px' }}
              alt=''
            />
          </Link>
        </div>
        <div className='menu-item menu-item--top'>
          <Tooltip id='directory-tooltip' title='Suite' placement='right'>
            <Link className='menu-item__link' to='/directory'>
              <i className='menu-item__icon material-icons'>home</i>
            </Link>
          </Tooltip>
        </div>
        <div className='menu-item menu-item--top'>
          <Tooltip
            id='notification-tooltip'
            title='Notifications'
            placement='right'
          >
            <Link to='/notifications' className='menu-item__link'>
              <i className='menu-item__icon material-icons'>mail_outline</i>
            </Link>
          </Tooltip>
        </div>
        <div className='menu-item menu-item--top'>
          <Tooltip id='ownership-tooltip' title='Ownership' placement='right'>
            <Link to='/ownership' className='menu-item__link'>
              <i className='menu-item__icon material-icons'>contacts</i>
            </Link>
          </Tooltip>
        </div>
        <div className='menu-item menu-item--bottom-3'>
          <Tooltip
            id='community-tooltip'
            title='Building Configuration'
            placement='right'
          >
            <Link className='menu-item__link' to='/community'>
              <i className='menu-item__icon material-icons'>business</i>
            </Link>
          </Tooltip>
        </div>
        <div className='menu-item menu-item--bottom-2'>
          <Tooltip
            id='changepassword-tooltip'
            title='Change Password'
            placement='right'
          >
            <Link className='menu-item__link' to='/'>
              <i
                onClick={this.onChangePass}
                className='menu-item__icon material-icons'
              >
                vpn_key
              </i>
            </Link>
          </Tooltip>
        </div>
        <div className='menu-item menu-item--bottom-1'>
          <Tooltip id='logout-tooltip' title='Log out' placement='right'>
            <Link className='menu-item__link' to='/'>
              <Logout>
                <LogoutButton />
              </Logout>
            </Link>
          </Tooltip>
        </div>
      </div>
    );
  }
}

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.getNotifications = this.getNotifications.bind(this);
    this.handleMessageSend = this.handleMessageSend.bind(this);
    this.handleMessageDelete = this.handleMessageDelete.bind(this);
    this.getUnits = this.getUnits.bind(this);
    this.state = {
      messages: [],
    };
    this.getNotifications();
    this.getUnits();
  }

  getUnits() {
    const component = this;
    global.internalApi
      .getBuildingUnits(global.buildingId)
      .then(function (data) {
        const units = data;
        let options = { 'All suites': _.map(units, 'suite') };
        const suiteOptions = _.fromPairs(
          _.map(_.sortBy(units, ['suite']), (unit) => {
            return [`Suite ${unit.suite}`, [unit.suite]];
          })
        );
        const tags = _.reduce(
          _.flatMap(units, (unit) => {
            return _.map(unit.tags, (tag) => {
              return { tag: tag.tag, unit: unit.suite };
            });
          }),
          (result, tag) => {
            (result[tag.tag] || (result[tag.tag] = [])).push(tag.unit);
            return result;
          },
          {}
        );
        _.merge(options, suiteOptions, tags);
        console.log('options', options);
        component.setState({ addressOptions: options });
      });
  }

  getNotifications() {
    const component = this;
    global.externalApi
      .getBuildingNotifications(global.buildingNum)
      .then((data) => {
        const notifications = _.map(data, (msg) => {
          //console.log('message', msg)
          const allAddressees = _.uniq(
            _.map(msg.m_house, (addr) => {
              return addr.House.split('-')[1];
            })
          );
          const displayAddressees =
            msg.m_house.length > 4
              ? `${allAddressees[0]}, ${allAddressees[1]}, ${
                  allAddressees[2]
                } and ${allAddressees.length - 3} others`
              : _.sum(
                  _.map(allAddressees, (a) => {
                    return a + ' ';
                  })
                );
          var parser = new DOMParser();
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
          };
        });
        component.setState({ messages: notifications });
      });
  }

  handleMessageSend(buildingId, toAddr, msgSubject, msgMessage) {
    console.log('sending message to ', toAddr);
    global.externalApi
      .sendNotification(buildingId, toAddr, msgSubject, msgMessage)
      .then(() => {
        this.getNotifications();
      });
  }

  handleMessageDelete(message) {
    global.externalApi.deleteNotification(message.id).then(() => {
      this.getNotifications();
    });
  }

  showComposeDialog() {
    this.setState({ showCompose: true });
  }

  //componentDidMount() {
  //  this.getNotifications();
  //}
  render() {
    return (
      <div>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Card style={{ margin: '20px' }}>
              <CardHeader></CardHeader>
              <CardText>
                {/* <MessageList getMessages={this.getNotifications}/> */}
                <MessageList
                  messages={this.state.messages}
                  onDelete={this.handleMessageDelete}
                ></MessageList>
              </CardText>
            </Card>
          </Grid>
        </Grid>
        <ComposeMessageDialog
          buildingId={global.buildingNum}
          onSend={this.handleMessageSend}
          addressOptions={this.state.addressOptions}
        />
      </div>
    );
  }
}

class Directory extends Component {
  constructor(props) {
    super(props);
    this.getUnitByNumber = this.getUnitByNumber.bind(this);
    this.getunitId = this.getunitId.bind(this);
    this.handleOccupantSave = this.handleOccupantSave.bind(this);
    this.handleOccupantDelete = this.handleOccupantDelete.bind(this);
    this.handleDirectorySave = this.handleDirectorySave.bind(this);
    this.handleDirectoryAdd = this.handleDirectoryAdd.bind(this);
    this.handleDirectoryDelete = this.handleDirectoryDelete.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.getUnits = this.getUnits.bind(this);
    this.getunitId = this.getunitId.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
    this.getDirectoryEntity = this.getDirectoryEntity.bind(this);
    //this.getTagList = this.getTagList.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleNewTagValueChange = this.handleNewTagValueChange.bind(this);
    this.handleTagSave = this.handleTagSave.bind(this);
    this.handleRemoveTag = this.handleRemoveTag.bind(this);
    this.handleFilterTag = this.handleFilterTag.bind(this);
    this.handleMessageDelete = this.handleMessageDelete.bind(this);
    this.handleOpenAlert = this.handleOpenAlert.bind(this);
    this.handleCloseAlert = this.handleCloseAlert.bind(this);
    this.isValueName = this.isValueName.bind(this);
    this.formateName = this.formateName.bind(this);
    this.state = {
      unit: {
        id: 1,
        number: '',
        tags: [],

        occupants: [],
        directoryEntries: [],
      },
      emptyOccupant: {},
      emptyDirectory: {},
      units: [],
      showSuite: false,
      showNewTag: false,
      addressOptions: {},
      tagList: [],
      openAlert: false,
      AlertMessage: '',
    };
    this.getUnits(global.buildingId);
  }

  handleOpenAlert(alertMessage) {
    this.setState({ openAlert: true, AlertMessage: alertMessage });
  }

  handleCloseAlert() {
    this.setState({ openAlert: false });
  }

  componentWillReceiveProps() {
    //this.getNotifications();
  }

  getTagList(buildingId) {
    const component = this;
    global.internalApi
      .getExistBuildingTags(buildingId)
      .then(function (data) {
        const tags = data;
        component.setState({ buildingTagList: tags });
      })
      .then(function () {
        let list = component.state.buildingTagList;
        if (component.state.unit) {
          list = component.state.buildingTagList.filter(
            (tag) =>
              !component.state.unit.tags.some(function (val) {
                return val.tag === tag;
              })
          );
        }
        component.setState({
          tagList: list,
        });
      });
  }

  getUnits(buildingId) {
    const component = this;
    global.internalApi
      .getBuildingUnits(buildingId)
      .then(function (data) {
        const units = _.map(data, (o) => {
          return {
            id: o.id,
            number: o.commaxId,
          };
        });
        component.setState({ units: units });
        const options = _.fromPairs(
          _.map(_.sortBy(units, ['number']), (unit) => {
            return [`Suite ${unit.number}`, [unit.number]];
          })
        );
        console.log('options', options);
        component.setState({ addressOptions: options });
      })
      .then(function () {
        //component.getUnitByNumber(global.firstUnit);
        //component.getNotifications();
      });
  }

  getunitId(number) {
    let o = _.filter(this.state.units, (o) => {
      return o.number == number;
    });
    let v = null;
    if (o.length > 0) {
      v = o[0].id;
    }
    return v;
  }

  getunitNumber(id) {
    let o = _.filter(this.state.units, (o) => {
      return o.id == id;
    });
    let v = null;
    if (o.length > 0) {
      v = o[0].number;
    }
    return v;
  }

  getUnitByNumber(number) {
    this.getUnitById(this.getunitId(number));
  }

  getUnitById(unitId) {
    const component = this;
    const number = component.getunitNumber(unitId);
    let unit = {};
    let directoryEntries = [];
    let emptyOccupant = {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      unitId: unit.id,
    };
    global.internalApi
      .getUnit(unitId)
      .then(function (data) {
        const occs = _.map(data.properyOccupants, (o) => {
          return {
            id: o.id,
            firstName: o.firstName,
            lastName: o.lastName,
            email: o.email,
            phone: o.phone,
            unitId: o.propertyId,
          };
        });
        unit = {
          id: data.id,
          number: data.suite,
          tags: data.tags,
          occupants: occs,
          directoryEntries: [],
        };
      })
      .then(function () {
        global.externalApi
          .getDirectoryEntry(global.buildingNum, number)
          .then(function (data) {
            _.map(data, (d) => {
              _.map(d.nickname, (o) => {
                directoryEntries.push({
                  id: o.hu_no,
                  name: o.username,
                  buildingId: d.building,
                  unitId: d.household,
                });
              });
            });
            unit.directoryEntries = directoryEntries;
            component.setState({
              unit: unit,
              emptyOccupant: {
                id: 0,
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                unitId: unit.id,
              },
              emptyDirectory: {
                id: 0,
                name: '',
                buildingId: global.buildingNum,
                unitId: number,
              },
            });
          });
      });
  }

  getNotifications(unitNum) {
    const component = this;
    if (unitNum == undefined) unitNum = component.state.unit.number;
    global.externalApi
      .getBuildingNotifications(global.buildingNum)
      .then((data) => {
        const notifications = _.map(data, (msg) => {
          //console.log('message', msg)
          const allAddressees = _.uniq(
            _.map(msg.m_house, (addr) => {
              return addr.House.split('-')[1];
            })
          );
          const displayAddressees =
            msg.m_house.length > 4
              ? `${allAddressees[0]}, ${allAddressees[1]}, ${
                  allAddressees[2]
                } and ${allAddressees.length - 3} others`
              : _.sum(
                  _.map(allAddressees, (a) => {
                    return a + ' ';
                  })
                );
          var parser = new DOMParser();
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
          };
        });
        const unitNotifications = _.filter(notifications, (msg) => {
          return msg.allSentTo.includes(unitNum);
        });
        component.setState({ messages: unitNotifications });
      });
    //const component = this;
    //global.externalApi.getNotifications().then((data)=> {
    //  const notifications = _.map(data, (msg) => {
    //    return {
    //      subject: msg.m_subject,
    //      type: msg.m_type,
    //      message: msg.m_content,
    //      sendDate: moment(msg.m_wdate, 'YYYYMMDDHHmm').format('l'),
    //      expires: moment(msg.m_edate, "YYYYMMDDHHmm").unix()
    //    }
    //  });
    //  this.setState({messages: notifications, showNotifications: true});
    //});
  }

  getDirectoryEntity(buildingId, unitId) {
    const component = this;
    let directoryEntries = [];
    global.externalApi
      .getDirectoryEntry(buildingId, unitId)
      .then(function (data) {
        _.map(data, (d) => {
          _.map(d.nickname, (o) => {
            directoryEntries.push({
              id: o.hu_no,
              name: o.username,
              buildingId: d.building,
              unitId: d.household,
            });
          });
        });
        let unit = component.state.unit;
        unit.directoryEntries = directoryEntries;
        component.setState({
          unit: unit,
        });
      });
  }

  handleSearchChange(unit) {
    console.log(`loading unit ${unit}`);
    this.getUnitByNumber(unit);
    this.getNotifications(unit[0]);
    this.setState({ showSuite: true });
  }

  handleOccupantSave(entity) {
    const component = this;
    if (entity.id > 0) {
      global.internalApi.updateOccupant(entity);
    } else {
      global.internalApi.addOccupant(entity).then(function (data) {
        component.getUnitById(entity.unitId);
      });
    }
    console.log('occupant updated: ', entity);
  }

  handleOccupantDelete(entities) {
    const component = this;
    _.each(entities, (entity) => {
      global.internalApi.deleteOccupants(entity.id).then(function (data) {
        component.getUnitByNumber(component.state.unit.number);
      });
    });
  }

  formateName(name) {
    return name.trim().replace(/\s\s+/g, ' ');
  }

  isValueName(name) {
    if (name.includes('#')) {
      return {
        valid: false,
        error: 'The # symbol cannot appear in the lobby directory.',
      };
    }
    if (name.length > global.maxNameLength) {
      return {
        valid: false,
        error:
          'The Maximum Length for Name is ' +
          global.maxNameLength +
          ' Characters.',
      };
    }
    let names = name.split(' ');
    let tooLong = names.some(function (val) {
      return val.length > global.maxWordLength;
    });
    if (tooLong) {
      return {
        valid: false,
        error:
          'The Maximum Length for a First or Last Name is ' +
          global.maxWordLength +
          ' Characters.',
      };
    }
    return { valid: true, error: '' };
  }

  handleDirectorySave(entity) {
    const component = this;
    let buildingId = entity.buildingId;
    let unitId = entity.unitId;
    entity.name = this.formateName(entity.name);
    var result = this.isValueName(entity.name);
    if (result.valid) {
      let name = JSON.stringify([
        { hu_no: entity.id, username: entity.name },
      ]).replace(/'/g, "''");
      global.externalApi
        .setDirectoryEntry(buildingId, unitId, name)
        .then(function (data) {
          component.getDirectoryEntity(buildingId, unitId);
        });
    } else {
      component.getDirectoryEntity(buildingId, unitId);
    }
    return result.error;
  }

  handleDirectoryAdd(entity) {
    const component = this;
    let buildingId = entity.buildingId;
    let unitId = entity.unitId;
    entity.name = this.formateName(entity.name);
    var result = this.isValueName(entity.name);
    if (result.valid) {
      let name = JSON.stringify([{ username: entity.name }]).replace(
        /'/g,
        "''"
      );
      global.externalApi
        .addDirectoryEntry(buildingId, unitId, name)
        .then(function (data) {
          component.getDirectoryEntity(buildingId, unitId);
        });
    } else {
      component.getDirectoryEntity(buildingId, unitId);
    }
    return result.error;
  }

  handleDirectoryDelete(entities) {
    const component = this;
    var name = [];
    var buildingId = '';
    var unitId = '';
    _.each(entities, (entity) => {
      buildingId = entity.buildingId;
      unitId = entity.unitId;
      name.push({ hu_no: entity.id });
    });
    let names = JSON.stringify(name).replace(/'/g, "''");
    console.log('deleting ', buildingId, unitId, name);
    global.externalApi
      .deleteDirectoryEntry(buildingId, unitId, names)
      .then(function (data) {
        component.getDirectoryEntity(buildingId, unitId);
      });
  }

  handleAddTag() {
    const component = this;
    global.internalApi
      .getExistBuildingTags(global.buildingId)
      .then(function (data) {
        let tags = data;
        if (component.state.unit) {
          tags = data.filter(
            (tag) =>
              !component.state.unit.tags.some(function (val) {
                return val.tag === tag;
              })
          );
        }
        component.setState({
          showNewTag: !component.state.showNewTag,
          newTagValue: '',
          tagList: tags,
        });
      });
  }

  handleNewTagValueChange(value) {
    this.setState({ newTagValue: _.capitalize(value) });
  }
  handleFilterTag(searchText, key) {
    return (
      searchText !== '' &&
      key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    );
  }

  handleTagSave() {
    const component = this;
    let exist = component.state.unit.tags.some(function (val) {
      return val.tag === component.state.newTagValue;
    });
    if (exist) {
      this.handleOpenAlert('The Same Tag Cannot be Added Twice.');
      return;
    }
    const newTag = {
      tag: this.state.newTagValue,
      PropertyId: this.state.unit.id,
    };
    global.internalApi.saveTag(newTag).then(function (data) {
      const addedTag = {
        id: data.id,
        tag: data.tag,
        PropertyId: data.PropertyId,
      };
      component.setState({
        unit: _.assign(component.state.unit, {
          tags: component.state.unit.tags.concat(addedTag),
        }),
        showNewTag: false,
      });
    });
  }

  handleRemoveTag(tag) {
    const component = this;
    global.internalApi.deleteTag(tag).then(function () {
      component.setState({
        unit: _.assign(component.state.unit, {
          tags: _.without(component.state.unit.tags, tag),
        }),
        showNewTag: false,
      });
    });
  }

  handleMessageDelete(message) {
    global.externalApi.deleteNotification(message.id).then(() => {
      this.getNotifications(this.state.unit.number);
    });
  }

  render() {
    const actions = [
      <FlatButton
        key='ok'
        label='OK'
        primary={true}
        onClick={this.handleCloseAlert}
      />,
    ];
    return (
      <div>
        <AutoCompleteSearch
          addressOptions={
            /*{
          'Suite 101': ['101'],
          'Suite 102': ['102'],
          'Suite 105': ['105']
        }*/
            this.state.addressOptions
          }
          handleAddressUpdate={this.handleSearchChange}
          hintText='Suite number'
        />
        <div style={{ display: this.state.showSuite ? 'none' : 'block' }}>
          <span
            style={{
              fontSize: '24px',
              color: 'rgba(0,0,0,0.87)',
              lineHeight: '48px',
            }}
          >
            Please select a suite using the search above
          </span>
        </div>
        <div
          style={{
            display: this.state.showSuite ? 'block' : 'none',
            height: '730px',
            overflowY: 'scroll',
            marginTop: '10px',
          }}
        >
          {/*<Paper zDepth={2} style={{'height': '700px', 'width':'95%','overflowY':'scroll','marginTop':'60px', 'marginLeft': '30px'}}>*/}
          <div style={{ marginLeft: '15px', height: '48px' }}>
            <div
              style={{ marginLeft: '15px', display: 'flex', flexWrap: 'wrap' }}
            >
              {_.map(this.state.unit.tags, (tag) => {
                return (
                  <Chip
                    onRequestDelete={() => {
                      this.handleRemoveTag(tag);
                    }}
                    style={{ margin: 4 }}
                  >
                    {' '}
                    {tag.tag}{' '}
                  </Chip>
                );
              })}
              <IconButton
                iconStyle={{ width: 24, height: 24 }}
                style={{
                  width: 36,
                  height: 36,
                  position: 'relative',
                  top: '-5px',
                }}
                onClick={this.handleAddTag}
              >
                <ContentAdd />
              </IconButton>
              <div
                style={{ display: this.state.showNewTag ? 'block' : 'none' }}
              >
                <AutoComplete
                  style={{ height: '36px', marginLeft: '10px' }}
                  listStyle={{ maxHeight: 200, overflow: 'auto' }}
                  hintText='Tag'
                  searchText={this.state.newTagValue}
                  dataSource={this.state.tagList}
                  onUpdateInput={(searchText, dataSource, params) => {
                    this.handleNewTagValueChange(searchText);
                  }}
                  filter={this.handleFilterTag}
                />
                {/*<TextField
                  style={{height:'36px',marginLeft:'10px',paddingTop:'4px'}}
                  hintText="Tag"
                  onChange={(event, value)=>{this.handleNewTagValueChange(value)}}>
                </TextField>*/}
                <FlatButton
                  label='Save'
                  primary={true}
                  style={{ marginLeft: '10px' }}
                  onClick={() => {
                    this.handleTagSave();
                  }}
                ></FlatButton>
              </div>
            </div>
            <span
              style={{
                fontSize: '36px',
                color: 'rgba(0,0,0,0.87)',
                lineHeight: '48px',
                position: 'relative',
                top: '-48px',
              }}
            >
              Suite {this.state.unit.number}{' '}
            </span>
          </div>

          <Grid container>
            <Grid container xs={5}>
              <Grid item xs={12}>
                <EntityCrudSummaryCard
                  searchHintText='First / last name'
                  entityName='Occupants'
                  entityProperties={[
                    { label: 'first name', name: 'firstName' },
                    { label: 'last name', name: 'lastName' },
                    { label: 'phone', name: 'phone' },
                  ]}
                  entitySchema={[
                    { label: 'first name', name: 'firstName', type: 'text' },
                    { label: 'last name', name: 'lastName', type: 'text' },
                    { label: 'phone', name: 'phone', type: 'text' },
                    { label: 'email', name: 'email', type: 'text' },
                  ]}
                  entities={this.state.unit.occupants}
                  emptyEntity={this.state.emptyOccupant}
                  onEntitySave={this.handleOccupantSave}
                  onEntityAdd={this.handleOccupantSave}
                  onEntitiesDelete={this.handleOccupantDelete}
                />
              </Grid>
              <Grid item xs={12}>
                <EntityCrudSummaryCard
                  searchHintText='Name'
                  entityName='Directory Entries'
                  entityProperties={[{ label: 'name', name: 'name' }]}
                  entitySchema={[{ label: 'name', name: 'name', type: 'text' }]}
                  entities={this.state.unit.directoryEntries}
                  emptyEntity={this.state.emptyDirectory}
                  onEntitySave={this.handleDirectorySave}
                  onEntityAdd={this.handleDirectoryAdd}
                  onEntitiesDelete={this.handleDirectoryDelete}
                  disableAdd={
                    this.state.unit.directoryEntries.length >=
                    global.maxLobbyEntries
                  }
                />
              </Grid>
            </Grid>
            <Grid container xs={7}>
              <Grid item xs={12}>
                <Card style={{ textAlign: 'left', margin: '20px' }}>
                  <CardTitle title='Notifications' />
                  <CardText>
                    <MessageList
                      onDelete={this.handleMessageDelete}
                      unitId={this.state.unit.id}
                      messages={this.state.messages}
                      style={{ height: '400px' }}
                    />
                  </CardText>
                </Card>
              </Grid>
            </Grid>
            <Dialog
              actions={actions}
              modal={true}
              open={this.state.openAlert}
              onRequestClose={this.handleCloseAlert}
            >
              {this.state.AlertMessage}
            </Dialog>
          </Grid>
          {/*</Paper>*/}
        </div>
      </div>
    );
  }
}

class Ownership extends Component {
  constructor(props) {
    super(props);
    this.getOwnershipTypes = this.getOwnershipTypes.bind(this);
    this.getOwnershipPersonTypes = this.getOwnershipPersonTypes.bind(this);
    this.getOwnershipByNumber = this.getOwnershipByNumber.bind(this);
    this.getunitId = this.getunitId.bind(this);
    this.handlePersonSave = this.handlePersonSave.bind(this);
    this.handlePersonDelete = this.handlePersonDelete.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.getUnits = this.getUnits.bind(this);
    this.getunitId = this.getunitId.bind(this);
    this.handleOwnershipUnitSave = this.handleOwnershipUnitSave.bind(this);
    this.handleOwnershipUnitDelete = this.handleOwnershipUnitDelete.bind(this);
    this.handleOwnershipSave = this.handleOwnershipSave.bind(this);
    this.handleTransfer = this.handleTransfer.bind(this);
    this.state = {
      ownership: {
        id: 1,
        activateDate: new Date(),
        inactivateDate: new Date(),
        typeId: 0,
        notes: '',
        avtive: true,
        people: [],
        properties: [],
      },
      unitNumber: '',
      unitId: '',
      buildingId: '',
      emptyPeople: {},
      emptyproperty: {},
      units: [],
      ownershipTypes: [],
      ownershipPersonTypes: [],
      ownershipProperties: [],
      showSuite: false,
      addressOptions: {},
      open: false,
    };
    this.handleOpen = () => {
      this.setState({ open: true });
    };

    this.handleClose = () => {
      this.setState({ open: false });
    };
    this.getOwnershipTypes();
    this.getOwnershipPersonTypes();
    this.getUnits(global.buildingId);
  }

  getOwnershipTypes() {
    const component = this;
    global.internalApi.getOwnershipTypes().then(function (data) {
      const types = _.map(data, (o) => {
        return {
          value: o.id,
          display: o.description,
        };
      });
      component.setState({ ownershipTypes: types });
    });
  }

  getOwnershipPersonTypes() {
    const component = this;
    global.internalApi.getOwnershipPersonTypes().then(function (data) {
      const types = _.map(data, (o) => {
        return {
          value: o.id,
          display: o.description,
        };
      });
      component.setState({ ownershipPersonTypes: types });
    });
  }

  getUnits(buildingId) {
    const component = this;
    global.internalApi
      .getBuildingUnits(buildingId)
      .then(function (data) {
        const units = _.map(data, (o) => {
          return {
            id: o.id,
            number: o.commaxId,
          };
        });
        component.setState({ units: units, buildingId: buildingId });
        const options = _.fromPairs(
          _.map(_.sortBy(units, ['number']), (unit) => {
            return [`Suite ${unit.number}`, [unit.number]];
          })
        );
        console.log('options', options);
        component.setState({ addressOptions: options });
      })
      .then(function () {
        //component.getUnitByNumber(global.firstUnit);
        //component.getNotifications();
      });
  }

  getunitId(number) {
    let o = _.filter(this.state.units, (o) => {
      return o.number == number;
    });
    let v = null;
    if (o.length > 0) {
      v = o[0].id;
    }
    return v;
  }

  getunitNumber(id) {
    let o = _.filter(this.state.units, (o) => {
      return o.id == id;
    });
    let v = null;
    if (o.length > 0) {
      v = o[0].number;
    }
    return v;
  }

  getOwnershipByNumber(number) {
    const component = this;
    const unitId = this.getunitId(number);
    component.setState({
      unitNumber: number,
      unitId: unitId,
    });
    this.getOwnershipById(unitId);
  }

  getOwnershipById(unitId) {
    const component = this;
    let ownership = {};
    this.handleClose();
    global.internalApi
      .getOwnershipByUnit(unitId)
      .then(function (data) {
        const people = _.map(data.ownershipPersons, (o) => {
          let fullAddress = o.address;
          if (o.suite && o.suite.trim().length > 0) {
            fullAddress += ' Suite ' + o.suite;
          }
          if (o.city && o.city.trim().length > 0) {
            fullAddress += ', ' + o.city;
          }
          if (o.province && o.province.trim().length > 0) {
            fullAddress += ', ' + o.province;
          }
          if (o.postcodeZip && o.postcodeZip.trim().length > 0) {
            fullAddress += ', ' + o.postcodeZip;
          }
          if (o.country && o.country.trim().length > 0) {
            fullAddress += ', ' + o.country;
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
          };
        });
        const properties = _.map(data.properties, (o) => {
          return {
            id: o.id,
            ownershipId: data.id,
            legalLevel: o.legalLevel,
            legalUnit: o.legalUnit,
            suite: o.suite,
            design: o.design,
            size: o.size,
            typeId: o.typeId,
            type: o.type.description,
          };
        });
        let activateDate = new Date(data.activateDate);
        let inactivateDate = new Date(data.inActivateDate);
        ownership = {
          id: data.id,
          activateDate: activateDate,
          inactivateDate:
            inactivateDate.getUTCFullYear() <= 1 ? undefined : inactivateDate,
          notes: data.notes ? data.notes : '',
          active: data.active,
          typeId: data.typeId,
          people: people,
          properties: properties,
        };
        let emptyPeople = {
          id: 0,
          salutation: '',
          firstName: '',
          middleName: '',
          lastName: '',
          address: '',
          suite: '',
          city: '',
          province: '',
          postcodeZip: '',
          country: '',
          email: '',
          homePhone: '',
          cellPhone: '',
          workPhone: '',
          typeId: 1,
          ownershipId: ownership.id,
          type: '',
        };
        let emptyproperty = {
          id: 0,
          ownershipId: ownership.id,
        };
        component.setState({
          ownership: ownership,
          emptyPeople: emptyPeople,
          emptyproperty: emptyproperty,
        });
      })
      .then(function () {
        global.internalApi
          .getBuildingOwnershipUnits(component.state.buildingId)
          .then(function (data) {
            const ownershipProperties = _.map(data, (d) => {
              return {
                value: d.id,
                display: d.suite + ' - ' + d.type.description,
              };
            });
            component.setState({
              ownershipProperties: ownershipProperties,
            });
          });
      });
  }

  handleSearchChange(unit) {
    console.log(`loading unit ${unit}`);
    this.getOwnershipByNumber(unit);
    this.setState({ showSuite: true });
  }

  handlePersonSave(entity) {
    const component = this;
    if (entity.id > 0) {
      global.internalApi.updateOwnershipPerson(entity).then(function (data) {
        component.getOwnershipById(component.state.unitId);
      });
    } else {
      global.internalApi.addOwnershipPerson(entity).then(function (data) {
        component.getOwnershipById(component.state.unitId);
      });
    }
    console.log('Person updated: ', entity);
  }

  handlePersonDelete(entities) {
    const component = this;
    _.each(entities, (entity) => {
      global.internalApi.deleteOwnershipPerson(entity.id).then(function (data) {
        component.getOwnershipById(component.state.unitId);
      });
    });
  }

  handleOwnershipUnitSave(entity) {
    const component = this;
    if (entity.id > 0) {
      global.internalApi
        .addOwnershipUnit(entity.id, entity.ownershipId)
        .then(function () {
          component.getOwnershipById(component.state.unitId);
        });
    }
  }

  handleOwnershipUnitDelete(entities) {
    const component = this;
    _.each(entities, (entity) => {
      global.internalApi
        .deleteOwnershipUnit(entity.id, entity.ownershipId)
        .then(function (data) {
          component.getOwnershipById(component.state.unitId);
        });
    });
  }

  handleOwnershipSave() {
    const component = this;
    if (this.state.ownership.id > 0) {
      global.internalApi
        .updateOwnership(this.state.ownership)
        .then(function () {
          component.getOwnershipById(component.state.unitId);
        });
    }
  }

  handleTransfer() {
    const component = this;
    this.handleClose();
    if (this.state.ownership.id > 0) {
      global.internalApi
        .transferOwnership(this.state.ownership.id)
        .then(function () {
          component.getOwnershipById(component.state.unitId);
        });
    }
  }

  render() {
    const transferActions = [
      <FlatButton
        key='cancel'
        label='Cancel'
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        key='submit'
        label='Submit'
        primary={true}
        disabled={false}
        onClick={this.handleTransfer}
      />,
    ];
    return (
      <div>
        <AutoCompleteSearch
          addressOptions={
            /*{
          'Suite 101': ['101'],
          'Suite 102': ['102'],
          'Suite 105': ['105']
        }*/
            this.state.addressOptions
          }
          handleAddressUpdate={this.handleSearchChange}
          hintText='Suite number'
        />
        <div style={{ display: this.state.showSuite ? 'none' : 'block' }}>
          <span
            style={{
              fontSize: '24px',
              color: 'rgba(0,0,0,0.87)',
              lineHeight: '48px',
            }}
          >
            Please select a suite using the search above
          </span>
        </div>
        <div
          style={{
            display: this.state.showSuite ? 'block' : 'none',
            height: '730px',
            overflowY: 'scroll',
            marginTop: '10px',
          }}
        >
          {/*<Paper zDepth={2} style={{'height': '700px', 'width':'95%','overflowY':'scroll','marginTop':'60px', 'marginLeft': '30px'}}>
          <div style={{'marginLeft': '15px',height:'48px'}}>
            <span style={{fontSize: '36px', color:'rgba(0,0,0,0.87)', lineHeight: '48px'}}>Suite {this.state.unitNumber} </span>
          </div>
        */}
          <Dialog
            title='Transfer Ownership'
            actions={transferActions}
            modal={true}
            open={this.state.open}
          >
            This will transfer the current ownership. Continue?
          </Dialog>
          <Grid container>
            <Grid container xs={12}>
              <Grid item xs={5}>
                <Card style={{ textAlign: 'left', margin: '20px' }}>
                  <CardTitle
                    title={'Suite ' + this.state.unitNumber}
                    subtitle='Ownership detail'
                  />
                  <CardText>
                    <Grid container>
                      <Grid container xs={12}>
                        <Grid item xs={6}>
                          <div>
                            <DatePicker
                              floatingLabelText='Activate Date'
                              floatingLabelFixed={true}
                              autoOk={true}
                              firstDayOfWeek={0}
                              formatDate={
                                new global.Intl.DateTimeFormat('en-US', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                }).format
                              }
                              value={this.state.ownership.activateDate}
                              onChange={(event, value) => {
                                let valueObj = {};
                                valueObj['activateDate'] = value;
                                this.setState({
                                  ownership: _.assign(
                                    this.state.ownership,
                                    valueObj
                                  ),
                                });
                              }}
                            />
                            <DatePicker
                              floatingLabelText='Inactivate Date'
                              floatingLabelFixed={true}
                              autoOk={true}
                              firstDayOfWeek={0}
                              formatDate={
                                new global.Intl.DateTimeFormat('en-US', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                }).format
                              }
                              value={this.state.ownership.inactivateDate}
                              onChange={(event, value) => {
                                let valueObj = {};
                                valueObj['inactivateDate'] = value;
                                this.setState({
                                  ownership: _.assign(
                                    this.state.ownership,
                                    valueObj
                                  ),
                                });
                              }}
                            />
                            <EntityCrudSelectField
                              label='Type'
                              value={this.state.ownership.typeId}
                              optionValues={this.state.ownershipTypes}
                              handleChange={(value) => {
                                let valueObj = {};
                                valueObj['typeId'] = value;
                                this.setState({
                                  ownership: _.assign(
                                    this.state.ownership,
                                    valueObj
                                  ),
                                });
                              }}
                            />
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <div>
                            <TextField
                              floatingLabelText='Notes'
                              floatingLabelFixed={true}
                              fullWidth={true}
                              multiLine={true}
                              rows={1}
                              rowsMax={5}
                              value={this.state.ownership.notes}
                              onChange={(event, value) => {
                                let valueObj = {};
                                valueObj['notes'] = value;
                                this.setState({
                                  ownership: _.assign(
                                    this.state.ownership,
                                    valueObj
                                  ),
                                });
                              }}
                            />
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardText>
                  <CardActions>
                    <RaisedButton
                      label='Save'
                      primary={true}
                      style={{ marginRight: '2em' }}
                      onClick={this.handleOwnershipSave}
                    />
                    <RaisedButton
                      label='Transfer'
                      primary={false}
                      style={{ marginRight: '2em' }}
                      onClick={this.handleOpen}
                    />
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={7}>
                <EntityCrudSummaryCard
                  searchHintText='Suite number'
                  entityName='Property'
                  entityProperties={[
                    { label: 'suite', name: 'suite' },
                    { label: 'type', name: 'type' },
                    { label: 'legal Level', name: 'legalLevel' },
                    { label: 'legal Unit', name: 'legalUnit' },
                  ]}
                  entitySchema={[
                    {
                      label: 'Property',
                      name: 'id',
                      type: 'options',
                      optionValues: this.state.ownershipProperties,
                    },
                  ]}
                  disableEdit={true}
                  NewEntityLable='Parking\Locker'
                  entities={this.state.ownership.properties}
                  emptyEntity={this.state.emptyproperty}
                  onEntityAdd={this.handleOwnershipUnitSave}
                  onEntitiesDelete={this.handleOwnershipUnitDelete}
                />
              </Grid>
              <Grid item xs={12}>
                <EntityCrudSummaryCard
                  searchHintText='First / last name'
                  entityName='People'
                  entityProperties={[
                    { label: 'Type', name: 'type' },
                    { label: 'first name', name: 'firstName' },
                    { label: 'last name', name: 'lastName' },
                    { label: 'Address', name: 'fullAddress' },
                    { label: 'Email', name: 'email' },
                    { label: 'home Phone', name: 'homePhone' },
                    { label: 'business Phone', name: 'workPhone' },
                    { label: 'Mobile', name: 'cellPhone' },
                  ]}
                  entitySchema={[
                    {
                      label: 'type',
                      name: 'typeId',
                      type: 'options',
                      optionValues: this.state.ownershipPersonTypes,
                    },
                    { label: 'salutation', name: 'salutation', type: 'text' },
                    { label: 'first name', name: 'firstName', type: 'text' },
                    { label: 'middle name', name: 'middleName', type: 'text' },
                    { label: 'last name', name: 'lastName', type: 'text' },
                    { label: 'address', name: 'address', type: 'text' },
                    { label: 'suite', name: 'suite', type: 'text' },
                    { label: 'city', name: 'city', type: 'text' },
                    { label: 'province', name: 'province', type: 'text' },
                    {
                      label: 'PostalCode/Zip',
                      name: 'postalcodeZip',
                      type: 'text',
                    },
                    { label: 'country', name: 'country', type: 'text' },
                    { label: 'email', name: 'email', type: 'text' },
                    { label: 'home Phone', name: 'homePhone', type: 'text' },
                    {
                      label: 'business Phone',
                      name: 'workPhone',
                      type: 'text',
                    },
                    { label: 'Mobile', name: 'cellPhone', type: 'text' },
                  ]}
                  entities={this.state.ownership.people}
                  emptyEntity={this.state.emptyPeople}
                  onEntitySave={this.handlePersonSave}
                  onEntityAdd={this.handlePersonSave}
                  onEntitiesDelete={this.handlePersonDelete}
                />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

class EditDirectoryCard extends Component {
  constructor(props) {
    super(props);
    this.setDirectoryEntry = this.setDirectoryEntry.bind(this);
    this.updateUnitId = this.updateUnitId.bind(this);
    this.updateName = this.updateName.bind(this);
    this.state = {
      unitId: '',
      name: '',
      dataSource: ['101', '102', '103'],
    };
  }

  updateUnitId(id) {
    this.setState({ unitId: id });
  }

  updateName(event, name) {
    this.setState({ name: name });
  }

  setDirectoryEntry() {
    const component = this;
    global.externalApi
      .setDirectoryEntry(101, component.state.unitId, component.state.name)
      .then(function (data) {
        console.log(data);
      });
  }

  render() {
    return (
      <Card style={{ textAlign: 'left', margin: '20px' }}>
        <CardTitle title='Edit' subtitle='Edit a directory entry' />
        <CardText>
          <div>
            <AutoComplete
              hintText='Suite'
              floatingLabelText='Suite'
              fullWidth={true}
              dataSource={this.state.dataSource}
              onUpdateInput={this.updateUnitId}
            />
            <TextField
              floatingLabelText='Lobby display name'
              fullWidth={true}
              onChange={this.updateName}
            />
          </div>
        </CardText>
        <CardActions>
          <RaisedButton
            label='Save'
            primary={true}
            style={{ marginRight: '2em' }}
            onClick={this.setDirectoryEntry}
          />
          <FlatButton label='Cancel' />
        </CardActions>
      </Card>
    );
  }
}

class CommunityConfiguration extends Component {
  constructor(props) {
    super(props);
    this.handleOccupantSave = this.handleOccupantSave.bind(this);
    this.handleOccupantDelete = this.handleOccupantDelete.bind(this);
    this.handleDirectorySave = this.handleDirectorySave.bind(this);
    this.handleDirectoryAdd = this.handleDirectoryAdd.bind(this);
    this.handleDirectoryDelete = this.handleDirectoryDelete.bind(this);
    this.getOccupants = this.getOccupants.bind(this);
    this.getDirectoryEntity = this.getDirectoryEntity.bind(this);
    this.getUnits = this.getUnits.bind(this);
    this.getunitId = this.getunitId.bind(this);
    this.getUnitById = this.getUnitById.bind(this);
    this.state = {
      buildingId: global.buildingId,
      units: [],
      occupants: [],
      directoryEntries: [],
      emptyOccupant: {
        id: 0,
        number: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        unitId: '',
      },
      emptyDirectory: {
        id: 0,
        name: '',
        buildingId: global.buildingNum,
        unitId: '',
      },
    };
    this.getUnits(global.buildingId);
    this.getOccupants(global.buildingId);
    this.getDirectoryEntity();
  }

  getUnits(buildingId) {
    const component = this;
    global.internalApi.getBuildingUnits(buildingId).then(function (data) {
      const units = _.map(data, (o) => {
        return {
          id: o.id,
          number: o.commaxId,
        };
      });
      component.setState({ units: units });
    });
  }

  getunitId(number) {
    let o = _.filter(this.state.units, (o) => {
      return o.number == number;
    });
    let v = null;
    if (o.length > 0) {
      v = o[0].id;
    }
    return v;
  }

  getUnitById(unitId) {
    const component = this;
    const number = component.getunitNumber(unitId);
    let unit = {};
    let directoryEntries = [];
    let emptyOccupant = {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      unitId: unit.id,
    };
    global.internalApi
      .getUnit(unitId)
      .then(function (data) {
        const occs = _.map(data.properyOccupants, (o) => {
          return {
            id: o.id,
            firstName: o.firstName,
            lastName: o.lastName,
            email: o.email,
            phone: o.phone,
            unitId: o.propertyId,
          };
        });
        unit = {
          id: data.id,
          number: data.suite,
          tags: [
            'Floor: ' + data.legalLevel,
            'Riser: ' + data.legalUnit,
            'Exposure: East',
          ],
          occupants: occs,
          directoryEntries: [],
        };
      })
      .then(function () {
        global.externalApi
          .getDirectoryEntry(global.buildingNum, number)
          .then(function (data) {
            _.map(data, (d) => {
              _.map(d.nickname, (o) => {
                directoryEntries.push({
                  id: o.hu_no,
                  name: o.username,
                  buildingId: d.building,
                  unitId: d.household,
                });
              });
            });
            unit.directoryEntries = directoryEntries;
            component.setState({
              unit: unit,
              emptyOccupant: {
                id: 0,
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                unitId: unit.id,
              },
              emptyDirectory: {
                id: 0,
                name: '',
                buildingId: global.buildingNum,
                unitId: number,
              },
            });
          });
      });
  }

  getOccupants(buildingId) {
    const component = this;
    global.internalApi.getOccupants(buildingId).then(function (data) {
      const occupants = _.map(data, (occ) => {
        return {
          id: occ.id,
          number: occ.unitNumber,
          firstName: occ.firstName,
          lastName: occ.lastName,
          email: occ.email,
          phone: occ.phone,
          unitId: occ.propertyId,
        };
      });
      component.setState({ occupants: occupants });
    });
  }

  handleOccupantSave(entity) {
    //NB: the EntityCrudSummaryCard will display the changes to the entity immediately,
    //regardless of what happens here
    //let occupant = _.concat(_.filter(this.state.occupants, (o)=>{return o.id != entity.id}), entity);
    const component = this;
    entity.unitId = this.getunitId(entity.number);
    if (entity.id > 0) {
      global.internalApi.updateOccupant(entity);
    } else {
      global.internalApi.addOccupant(entity).then(function (data) {
        component.getOccupants(component.state.buildingId);
      });
    }
    console.log('occupant updated: ', entity);
  }

  handleOccupantDelete(entities) {
    const component = this;
    _.each(entities, (entity) => {
      global.internalApi.deleteOccupants(entity.id).then(function (data) {
        component.getUnitById(entity.unitId);
      });
    });
  }

  getDirectoryEntity() {
    const component = this;
    let directoryEntries = [];
    global.externalApi.getAllDirectoryEntry().then(function (data) {
      _.map(data, (d) => {
        _.map(d.nickname, (o) => {
          directoryEntries.push({
            id: o.hu_no,
            name: o.username,
            buildingId: d.building,
            number: d.household,
          });
        });
      });
      component.setState({
        directoryEntries: directoryEntries,
      });
    });
  }

  handleDirectorySave(entity) {
    const component = this;
    let buildingId = entity.buildingId;
    let unitId = entity.number;
    let name = JSON.stringify([
      { hu_no: entity.id, username: entity.name },
    ]).replace(/'/g, "''");
    global.externalApi
      .setDirectoryEntry(buildingId, unitId, name)
      .then(function (data) {
        component.getDirectoryEntity();
      });
  }

  handleDirectoryAdd(entity) {
    const component = this;
    let buildingId = entity.buildingId;
    let unitId = entity.number;
    let name = JSON.stringify([{ username: entity.name }]).replace(/'/g, "''");
    global.externalApi
      .addDirectoryEntry(buildingId, unitId, name)
      .then(function (data) {
        component.getDirectoryEntity();
      });
  }

  handleDirectoryDelete(entities) {
    const component = this;
    _.each(entities, (entity) => {
      let buildingId = entity.buildingId;
      let unitId = entity.number;
      let name = JSON.stringify([{ hu_no: entity.id }]).replace(/'/g, "''");
      console.log('deleting ', buildingId, unitId, name);
      global.externalApi
        .deleteDirectoryEntry(buildingId, unitId, name)
        .then(function (data) {
          component.getDirectoryEntity();
        });
    });
  }

  render() {
    return (
      <Grid container>
        <Grid item xs={6}>
          <EntityCrudSummaryCard
            searchHintText='Suite number, first / last name'
            entityName='Suite Occupants'
            entityProperties={[
              { label: 'number', name: 'number' },
              { label: 'first name', name: 'firstName' },
              { label: 'last name', name: 'lastName' },
            ]}
            entitySchema={[
              { label: 'Suite number', name: 'number', type: 'text' },
              { label: 'first name', name: 'firstName', type: 'text' },
              { label: 'last name', name: 'lastName', type: 'text' },
              { label: 'phone', name: 'phone', type: 'text' },
              { label: 'email', name: 'email', type: 'text' },
            ]}
            entities={this.state.occupants.sort(
              (obj1, obj2) => obj1.number - obj2.number
            )}
            emptyEntity={this.state.emptyOccupant}
            onEntitySave={this.handleOccupantSave}
            onEntityAdd={this.handleOccupantSave}
            onEntitiesDelete={this.handleOccupantDelete}
          />
        </Grid>
        <Grid item xs={6}>
          <EntityCrudSummaryCard
            searchHintText='Suite number, name'
            entityName='Directory Entries'
            entityProperties={[
              { label: 'Number', name: 'number' },
              { label: 'Name', name: 'name' },
            ]}
            entitySchema={[
              { label: 'suite number', name: 'number', type: 'text' },
              { label: 'name', name: 'name', type: 'text' },
            ]}
            entities={this.state.directoryEntries}
            emptyEntity={this.state.emptyDirectory}
            onEntitySave={this.handleDirectorySave}
            onEntityAdd={this.handleDirectoryAdd}
            onEntitiesDelete={this.handleDirectoryDelete}
          />
        </Grid>
      </Grid>
    );
  }
}

export default App;
