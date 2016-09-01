import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';

const style = {
    width: '250px',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    padding: '1rem',
    fontSize: '1rem',
    lineHeight: 'normal',
    float: 'left',
    background: '#fafafa',
};

import Card from '../card/card'
import Form from './form.js';
import uuid from 'node-uuid';

import * as ReactRethinkdb from 'react-rethinkdb';
var r = ReactRethinkdb.r;

class CardList extends Component {


    _renderCards(cards) {
        if (cards && cards.length > 0) {
            return cards.map((item, index) =>
                <Card key={index} item={item} />
            )
        }
    }

    handleSubmit(refs) {
        var {creator, body} = refs;
        var query = r.table('lists').get(this.props.list.id).update({
            cards: r.row('cards').append({
                creator: creator.value,
                body: body.value,
                date: new Date(),
                id: uuid.v4(),
                listId: this.props.list.id
            })
        });
        body.value = '';
        ReactRethinkdb.DefaultSession.runQuery(query);
    }

    render() {
        const { canDrop, isOver, connectDropTarget } = this.props;
        const isActive = canDrop && isOver;
        return connectDropTarget(
            <div style={style}>
                <div style={{ marginBottom: '10px' }}>
                    <h3 className="ui header">{this.props.list.name}</h3>
                </div>
                {
                    (this.props.list.cards && this.props.list.cards.length > 0) ?
                    <div className="ui cards">
                        {this._renderCards(this.props.list.cards) }
                    </div>
                    : ''
                }
                <div>
                    <Form handleSubmit={this.handleSubmit.bind(this) } />
                </div>
            </div>
        )
    }
}

const dustbinTarget = {
    drop: function (props, monitor) {
        props.onDrop(monitor.getItem());
    }
};

export default DropTarget(['CARD'], dustbinTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))(CardList);