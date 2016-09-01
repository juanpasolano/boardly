import React, { Component } from 'react';
import './App.css';
import Board from './components/board/board';
import * as ReactRethinkdb from 'react-rethinkdb';
import {DragDropContext} from 'react-dnd';
import  HTML5Backend from 'react-dnd-html5-backend';

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
        <Board/>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
