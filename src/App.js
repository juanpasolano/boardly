import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Chat from  './chat/chat';

import * as ReactRethinkdb from 'react-rethinkdb';

// Open a react-rethinkdb session (a WebSocket connection to the server)
ReactRethinkdb.DefaultSession.connect({
  host: 'localhost', // hostname of the websocket server
  port: 8015,        // port number of the websocket server
  path: '/db',       // HTTP path to websocket route
  secure: false,     // set true to use secure TLS websockets
  db: 'react',        // default database, passed to rethinkdb.connect
});

class App extends Component {

  render() {
    return (
      <div>
        <Chat/>
      </div>
    );
  }
}

export default App;
