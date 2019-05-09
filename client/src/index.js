import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';
let URL = `${window.location.protocol}//${window.location.hostname}:8080`;
if (process.env.NODE_ENV === 'production') {
  URL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
}
const socket = io.connect(URL);
/* global document */
render(
  <SocketProvider socket={socket}>
    <Provider store={store}>
      <App />
    </Provider>
  </SocketProvider>,
  document.getElementById('root')
);
registerServiceWorker();
