import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import AuthReducer from '../modules/auth/AuthReducer';
import ConnectionReducer from '../modules/connection/ConnectionReducer';
import loggingReducer from '../modules/logging/LoggingReducer'

const reducers = {
  auth: AuthReducer,
  connection: ConnectionReducer,
  form: formReducer,
  loggingData: loggingReducer
};

export default combineReducers(reducers);
