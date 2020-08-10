import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import ExternalApiService from './externalApi';
import InternalApiService from './internalApi';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { setupCognito, cognito } from 'react-cognito';
import { loginReducer, rememberMeAction } from './login';
import Amplify from 'aws-amplify';

//import config from './config';
const config = {
  region: 'us-east-1',
  userPool: 'us-east-1_nj08HRZEB',
  identityPool: 'us-east-1:1f2a4a52-981a-47a2-b574-7ab8edd2d7a8',
  clientId: '4i8rk69ldlk9ho3nnhfcik06ob',
};

const awsmobile = {
  aws_cognito_identity_pool_id:
    'us-east-1:1f2a4a52-981a-47a2-b574-7ab8edd2d7a8',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: 'us-east-1_nj08HRZEB',
  aws_user_pools_web_client_id: '4i8rk69ldlk9ho3nnhfcik06ob',
};

/*
//Ten York
const config = {
  region: 'us-east-1',
  userPool: 'us-east-1_U3Ph97H8o',
  identityPool: 'us-east-1:1f2a4a52-981a-47a2-b574-7ab8edd2d7a8',
  clientId: '1aap243odc5h5pbenhc73l3nai',
};

const awsmobile = {
  aws_cognito_identity_pool_id:
    'us-east-1:1f2a4a52-981a-47a2-b574-7ab8edd2d7a8',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: 'us-east-1_U3Ph97H8o',
  aws_user_pools_web_client_id: '1aap243odc5h5pbenhc73l3nai',
};
*/
/*
const config = {
  region: 'us-east-1',
  userPool: 'us-east-1_em9Yy3oMR',
  identityPool: 'us-east-1:1f2a4a52-981a-47a2-b574-7ab8edd2d7a8',
  clientId: '8hcgk8e6s0lu20o1v13tbfup4',
};
*/
/*
const config = {
  region: 'us-east-1',
  userPool: 'us-east-1_U3Ph97H8o',
  identityPool: 'us-east-1:1f2a4a52-981a-47a2-b574-7ab8edd2d7a8',
  clientId: '1aap243odc5h5pbenhc73l3nai',
};
*/
Amplify.configure(awsmobile);

const isProduction = true;
if (isProduction) {
  global.internalApi = new InternalApiService(
    'api-grandview.smartonesolutions.ca'
  ); //('localhost:54961');//
  global.externalApi = new ExternalApiService(
    'api-grandview.smartonesolutions.ca/external',
    global.internalApi
  ); //76.70.164.102
} else {
  global.internalApi = new InternalApiService(
    'api-grandview.smartonesolutions.ca'
  ); //('localhost:54961');//
  global.externalApi = new ExternalApiService(
    'api-grandview.smartonesolutions.ca/external',
    global.internalApi
  ); //76.70.164.102
}
global.buildingId = 2;
global.buildingNum = '101';
global.units = [];
global.firstUnit = '101';
global.maxLobbyEntries = 4;
global.maxWordLength = 24;
global.maxNameLength = 48;

const login = loginReducer;
const persistLogin = 'loginState';

String.isNullOrEmpty = function (value) {
  return !(typeof value === 'string' && value.length > 0);
};

const loginState = localStorage.getItem(persistLogin)
  ? JSON.parse(localStorage.getItem(persistLogin))
  : {};
const reducers = combineReducers({ cognito, login });
let store = createStore(
  reducers,
  loginState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
store.subscribe(() => {
  localStorage.setItem(persistLogin, JSON.stringify(store.getState().login));
});

store.dispatch(rememberMeAction.set(loginState.rememberMe));

setupCognito(store, config);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

//ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
