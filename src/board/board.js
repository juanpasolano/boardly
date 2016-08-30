import React, { Component } from 'react';

import * as ReactRethinkdb from 'react-rethinkdb';
var reactMixin = require('react-mixin');
var r = ReactRethinkdb.r;

import Card from '../card/card';

class Board extends Component {

  observe (props, state) {
    return {
      cards: new ReactRethinkdb.QueryRequest({
        query: r.table('cards'),
        changes: true,
        initial: [],              
      }),
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    var {creator, body} = this.refs;
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
            return (<Card key={item.id} {...item} />)
        })
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
            <div className="ui form">
                <div className="fields">
                    <div className="field">
                        <label>Name</label>
                        <input type="text" placeholder="Name" ref="creator"/>
                    </div>
                    <div className="field">
                        <label>Body</label>
                        <input type="text" placeholder="Body" ref="body"/>
                    </div>
                </div>
            </div>
            <button className="ui button" type="submit">Submit</button>
        </form>  
        {this._renderCards()}
      </div>
    );
  }
}

export default reactMixin.onClass(Board, ReactRethinkdb.DefaultMixin );
