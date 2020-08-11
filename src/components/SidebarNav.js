import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Logout } from 'react-cognito'

import Tooltip from 'material-ui-next/Tooltip'

import smart1 from '../assets/ONElogo_ns.png'

import { rememberMeAction } from '../store/login'

import { LogoutButton } from '.'

export default class SidebarNav extends Component {
  onChangePass = () => {
    this.props.dispatch(rememberMeAction.setChangePass(true))
  }
  render() {
    return (
      <div className="sidebar">
        <div className="menu-item menu-item--top menu-item--home">
          <Link className="menu-item__logo active" to="/">
            <img
              src={smart1}
              style={{ width: '40px', marginTop: '4px' }}
              alt=""
            />
          </Link>
        </div>
        <div className="menu-item menu-item--top">
          <Tooltip id="directory-tooltip" title="Suite" placement="right">
            <Link className="menu-item__link" to="/directory">
              <i className="menu-item__icon material-icons">home</i>
            </Link>
          </Tooltip>
        </div>
        <div className="menu-item menu-item--top">
          <Tooltip
            id="notification-tooltip"
            title="Notifications"
            placement="right"
          >
            <Link to="/notifications" className="menu-item__link">
              <i className="menu-item__icon material-icons">mail_outline</i>
            </Link>
          </Tooltip>
        </div>
        <div className="menu-item menu-item--top">
          <Tooltip id="ownership-tooltip" title="Ownership" placement="right">
            <Link to="/ownership" className="menu-item__link">
              <i className="menu-item__icon material-icons">contacts</i>
            </Link>
          </Tooltip>
        </div>
        <div className="menu-item menu-item--bottom-3">
          <Tooltip
            id="community-tooltip"
            title="Building Configuration"
            placement="right"
          >
            <Link className="menu-item__link" to="/community">
              <i className="menu-item__icon material-icons">business</i>
            </Link>
          </Tooltip>
        </div>
        <div className="menu-item menu-item--bottom-2">
          <Tooltip
            id="changepassword-tooltip"
            title="Change Password"
            placement="right"
          >
            <Link className="menu-item__link" to="/">
              <i
                onClick={this.onChangePass}
                className="menu-item__icon material-icons"
              >
                vpn_key
              </i>
            </Link>
          </Tooltip>
        </div>
        <div className="menu-item menu-item--bottom-1">
          <Tooltip id="logout-tooltip" title="Log out" placement="right">
            <Link className="menu-item__link" to="/">
              <Logout>
                <LogoutButton />
              </Logout>
            </Link>
          </Tooltip>
        </div>
      </div>
    )
  }
}
