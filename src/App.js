import React, { Component } from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import Board from './components/board/board';
import store from './redux/store';

const history = syncHistoryWithStore(browserHistory, store)

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/">
            <Route path="board" component={Board}/>
          </Route>
        </Router>
      </Provider>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
