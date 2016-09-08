import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import Board from './components/board/board';
import Login from './components/login/login';
import store from './redux/store';

const history = syncHistoryWithStore(browserHistory, store)

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/">
            <IndexRoute component={Login} />
            <Route path="/board" component={Board}/>
          </Route>
        </Router>
      </Provider>
    );
  }
}

export default App;
