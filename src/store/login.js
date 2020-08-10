const SET_ALL = 'SET_ALL'
const SET_LOGIN = 'SET_LOGIN'
const SET_CHANGE_PASS = 'SET_CHANGE_PASS'

const initState = {
  rememberMe: false,
  userLogin: false,
  changePass: false,
}

export const loginReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_ALL:
      return Object.assign({}, state, {
        rememberMe: action.rememberMe,
        userLogin: action.userLogin,
        changePass: action.changePass,
      })
    case SET_LOGIN:
      return Object.assign({}, state, {
        userLogin: action.userLogin,
      })
    case SET_CHANGE_PASS:
      return Object.assign({}, state, {
        changePass: action.changePass,
      })
    default:
      return state
  }
}

export const rememberMeAction = {
  set: (rememberMe, userLogin = false, changePass = false) => ({
    type: SET_ALL,
    rememberMe: rememberMe,
    userLogin: userLogin,
    changePass: changePass,
  }),
  clearlogin: {
    type: SET_LOGIN,
    userLogin: false,
  },
  setlogin: {
    type: SET_LOGIN,
    userLogin: true,
  },
  remember: {
    type: SET_ALL,
    rememberMe: true,
    userLogin: true,
  },
  forget: {
    type: SET_ALL,
    rememberMe: false,
    userLogin: true,
  },
  setChangePass: (change) => ({
    type: SET_CHANGE_PASS,
    changePass: change,
  }),
}
