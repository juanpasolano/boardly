import React, { Component } from 'react';

import * as ReactRethinkdb from 'react-rethinkdb';
var reactMixin = require('react-mixin');
var r = ReactRethinkdb.r;

import Card from '../card/card';
import CardList from '../card-list/card-list';
import Form from './form.js';

var _ = require('lodash'); 

class Board extends Component {
  constructor(props){
    super(props);
    this.state = {
      filter: {
        list: null
      }
    }
  }

  observe (props, state) {
    return {
      cards: new ReactRethinkdb.QueryRequest({
        query: r.table('cards').filter(_.pick(this.state.filter, _.identity)),
        changes: true,
        initial: [],              
      }),
    };
  }

  handleSubmit(refs) {
    var {creator, body} = refs;
    var query = r.table('cards').insert({
        creator: creator.value, 
        body: body.value, 
        date: new Date()
    });
    body.value = '';
    ReactRethinkdb.DefaultSession.runQuery(query);
  }

  _renderCards() {
    if(this.data.cards) {
        return this.data.cards.value().map( (item) => {
            return (<Card key={item.id} item={item} />)
        })
    }
  }
  _renderCardLists() {
    var lists = [{name: 'list name', id: 1}, {name: 'other list name', id: 2}];
    return (
      lists.map(item => {
        return (
          <CardList accepts={['CARD']} key={item.id} onDrop={(droppedItem) => this.handleDrop(droppedItem, item)}/>
        )
      })
    )
  }

  handleDrop(droppedItem, target) {
    console.log(droppedItem, target)
    var query = r.table('cards').get(droppedItem.id).update({
        list: target.id
    });
    ReactRethinkdb.DefaultSession.runQuery(query);
  }

  render() {
    return (
      <div>
        <button onClick={()=> (this.setState({ filter: {list:1} } ))}>Set 1</button>    
        <Form handleSubmit={this.handleSubmit.bind(this)} />
        {this._renderCardLists()}
        <div className="ui cards">
            {this._renderCards()}
        </div>
      </div>
    );
  }
}

export default reactMixin.onClass(Board, ReactRethinkdb.DefaultMixin );
