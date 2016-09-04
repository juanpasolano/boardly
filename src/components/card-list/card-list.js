import React, { Component } from 'react';
import { DropTarget, DragSource } from 'react-dnd';

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


/**
 * For dragging
 */
const cardSource = {
    beginDrag(props) {
        return {...props };
    }
};
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}
/**
 * For dropping
 */
const cardListTarget = {
    drop: function (props, monitor, component) {
        component.setState({
            lastCardDragIndex: null,
            lastCardHoverIndex: null});

        props.onDrop(monitor.getItem().item);
    }
};

@DragSource('CARD-LIST', cardSource, collect)
@DropTarget(['CARD'], cardListTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()   
}))
class CardList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lastCardDragIndex: null,
            lastCardHoverIndex: null
        }
    }

    handleSubmit(refs) {
        let {creator, body} = refs;
        let card = {
            creator: creator.value,
            body: body.value,
            date: new Date(),
            id: new Date().getTime(),
            listId: this.props.list.id
        }
        if (this.props.onNewCard) this.props.onNewCard(card);
    }

    swapIndices(array, index1, index2) {
        const newArray = array.slice();
        newArray[index1] = array[index2];
        newArray[index2] = array[index1];
        return newArray;
    }

    moveCard(dragIndex, hoverIndex, monitor) {
        if (dragIndex !== this.state.lastCardDragIndex
            && hoverIndex !== this.state.lastCardHoverIndex) {

            this.setState({ lastCardDragIndex: dragIndex, lastCardHoverIndex: hoverIndex }
                , () => {
                    const { cards } = this.props.list;
                    const newArray = this.swapIndices(cards, dragIndex, hoverIndex);
                    if (this.props.onMoveCard) this.props.onMoveCard(newArray);
                    monitor.getItem().index = hoverIndex;
                })
        }
    }


    _renderCards(cards) {
        if (cards && cards.length > 0) {
            return cards.map((item, index) =>
                <Card key={item.id} item={item} index={index} moveCard={this.moveCard.bind(this) } />
            )
        }
    }


    render() {
        const { connectDropTarget } = this.props;
        const { connectDragSource } = this.props;
        return connectDragSource(connectDropTarget(
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
        ))
    }
}

export default CardList;