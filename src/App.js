import React, { Component } from 'react';
import './App.css';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';

import Board from './components/board/board';
import store from './redux/store';




class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Board/>
      </Provider>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
