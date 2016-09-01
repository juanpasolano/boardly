import React, { Component } from 'react';

import * as ReactRethinkdb from 'react-rethinkdb';
import reactMixin from 'react-mixin';
var r = ReactRethinkdb.r;

import CardList from '../card-list/card-list';

var _ = require('lodash');

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        list: null
      }
    }
  }

  observe(props, state) {
    return {
      lists: new ReactRethinkdb.QueryRequest({
        query: r.table('lists').filter(_.pick(this.state.filter, _.identity)),
        changes: true,
        initial: [],
      }),
    };
  }

  _renderCardLists(lists) {
    if (this.data.lists) {
      return this.data.lists.value().map(item =>
        <CardList
          accepts={['CARD']}
          key={item.id}
          list={item}
          onDrop={(droppedItem) => this.handleDrop(droppedItem, item) }/>
      )
    }
  }

  _deleteCardFromCurrentList(droppedItem) {
    var queryDeleteCard = r.table('lists')
    .get(droppedItem.listId)
    .update(function (row)  {
      return {
        'cards': row('cards')
          .filter( item => item('id').ne(droppedItem.id))
      }
    })
    var queryDeleteCardPromise = ReactRethinkdb.DefaultSession.runQuery(queryDeleteCard);
  }
  _addCardToTargetList(droppedItem, target) {
    var q1 = r.table('lists').get(target.id)('cards').filter({ id: droppedItem.id });
    var q1q = ReactRethinkdb.DefaultSession.runQuery(q1)
    q1q.then(function (cards) {
      if (cards.length === 0) {
        var query = r.table('lists').get(target.id).update({
          cards: r.row('cards').append({ ...droppedItem, listId: target.id })
        });
        ReactRethinkdb.DefaultSession.runQuery(query);
      }
    });
  }
  handleDrop(droppedItem, target) {
    this._deleteCardFromCurrentList(droppedItem);
    this._addCardToTargetList(droppedItem, target);
  }

  render() {
    return (
      <div>
        <button onClick={() => (this.setState({ filter: { list: 1 } })) }>Set 1</button>
        {this._renderCardLists() }
      </div>
    );
  }
}

export default reactMixin.onClass(Board, ReactRethinkdb.DefaultMixin);
