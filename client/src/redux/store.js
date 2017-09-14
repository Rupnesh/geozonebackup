import { applyMiddleware, createStore, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

import reducer from './reducer';
import { history } from '../utils/history';

// create the store

const routersMiddleware = routerMiddleware(history);

const middleware = [
  thunk,
  routersMiddleware
];

const enhancers = [
  applyMiddleware(...middleware)
];

/* Enable redux dev tools only in development.
 * We suggest using the standalone React Native Debugger extension:
 * https://github.com/jhen0409/react-native-debugger
 */
/* eslint-disable no-undef */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable no-undef */

const enhancer = composeEnhancers(...enhancers);

// create the store
const store = createStore(
  reducer,
  {},
  enhancer
);

if (module.hot) {
  module.hot.accept('./reducer', () => {
    store.replaceReducer(reducer);
  });
}
export default store;

