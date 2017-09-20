import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:8080');
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
