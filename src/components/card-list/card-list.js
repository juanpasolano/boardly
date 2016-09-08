import React, { Component } from 'react';
import { DropTarget, DragSource } from 'react-dnd';

import Card from '../card/card'
import Form from './form.js';
import EditableInput from './editable-input';


const styles = {
    list: {
        width: '250px',
        marginRight: '1.5rem',
        marginBottom: '1.5rem',
        padding: '1rem',
        fontSize: '1rem',
        lineHeight: 'normal',
        float: 'left',
        background: '#fafafa',
    }
};

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
        if(props.isOverCurrent){
            component.setState({
                lastCardDragIndex: null,
                lastCardHoverIndex: null});

            props.onDrop(monitor.getItem().item);
        }
    }
};

@DragSource('CARD-LIST', cardSource, collect)
@DropTarget(['CARD'], cardListTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    isOverCurrent: monitor.isOver({ shallow: true })
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

    onSubmitEditTitle(refs) {
        if(this.props.onSubmitEditTitle) this.props.onSubmitEditTitle(refs.title.value)
    }


    _renderCards(cards) {
        if (cards && cards.length > 0) {
            return cards.map((item, index) =>{
                return <Card key={item.id} item={item} index={index} />
                }
            )
        }
    }


    render() {
        const { connectDropTarget, isOverCurrent } = this.props;
        const { connectDragSource } = this.props;
        return connectDragSource(connectDropTarget(
            <div style={styles.list}>
                <div className="m-b-2">
                    <EditableInput onSubmit={this.onSubmitEditTitle.bind(this)} value={this.props.list.name}>
                        <h3 className="ui header">{this.props.list.name || 'Set a name...'}</h3>
                    </EditableInput>
                </div>
                {
                    (this.props.list.cards && this.props.list.cards.length > 0) ?
                        <div className="ui cards">
                            {this._renderCards(this.props.list.cards) }
                        </div>
                        : ''
                }
                <div className="m-t-3">
                    <Form handleSubmit={this.handleSubmit.bind(this) } />
                </div>
            </div>
        ))
    }
}

export default CardList;