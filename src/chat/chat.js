import React, { Component } from 'react';

import * as ReactRethinkdb from 'react-rethinkdb';
var reactMixin = require('react-mixin');
var r = ReactRethinkdb.r;


class Chat extends Component {

  observe (props, state) {
    return {
      messages: new ReactRethinkdb.QueryRequest({
        query: r.table('messages'),
        changes: true,
        initial: [],              
      }),
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    var nameInput = this.refs.name;
    var messageInput = this.refs.message;
    var query = r.table('messages').insert({name: nameInput.value, message: messageInput.value, date: new Date()});
    messageInput.value = '';
    ReactRethinkdb.DefaultSession.runQuery(query);
  }

  _renderMessages() {
    if(this.data.messages) {
      return (
      <div className="ui list">
            { this.data.messages.value().map( (item) => {
            return (
            <div className="item" key={item.id} >
              <img className="ui avatar image" src="http://semantic-ui.com/images/avatar/small/jenny.jpg" alt={item.name} />
                <div className="content">
                  <a className="header">{item.name}</a>
                <div className="description">{item.message}</div>
              </div>
            </div>
            ) 
          } ) }
      </div>
      )
    } else {
      return 'no messages';
    }
  }

  render() {
    return (
      <div>
        <p>
          To get started, edit <code>src/Chat.js</code> and save to reload.
        </p>
        { this._renderMessages() }

        <form onSubmit={this.handleSubmit.bind(this)}>
          <input ref="name" placeholder="name"/>
          <input ref="message" placeholder="message" />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default reactMixin.onClass(Chat, ReactRethinkdb.DefaultMixin );
