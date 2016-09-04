import React, { Component } from 'react';
import {DragDropContext} from 'react-dnd';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import Board from './components/board/board';
import SortableSimple from './components/sortable/index';
console.log(Board);
import store from './redux/store';

const history = syncHistoryWithStore(browserHistory, store)

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/">
            <Route path="sort" component={SortableSimple}/>
            <Route path="board" component={Board}/>
          </Route>
        </Router>
      </Provider>
    );
  }
}

export default App;
