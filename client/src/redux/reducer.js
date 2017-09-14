import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import AuthReducer from '../modules/auth/AuthReducer';
import ConnectionReducer from '../modules/connection/ConnectionReducer';

const reducers = {
  auth: AuthReducer,
  connection: ConnectionReducer,
  form: formReducer
};

export default combineReducers(reducers);
