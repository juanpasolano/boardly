import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import { connect } from 'react-redux';
import { moveCard } from '../../redux/actions'
import './card.css'
import { DropTarget, DragSource } from 'react-dnd';

const styles = {
    card: {
        margin: '.3em .5em',
    },
    cardDragging: {
        border: '1px dashed',
        opacity: 0.3
    }
}
/**
 * for Dragging
 */
const cardSource = {
    beginDrag(props) {
        return {
            item: props.item,
            index: props.index
        };
    },
    isDragging(props, monitor) {
        return props.item.id === monitor.getItem().item.id
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
const cardTarget = {
    hover(props, monitor, component) {
        props.moveCard(props, monitor, component);
    },
    drop(props, monitor, component) {
        console.log(props, monitor, component);
    }
};
/**
 * Container settings
 */
const mapDispatchToProps = (dispatch) => {
    return {
        moveCard
    }
}

@connect(() => { return {} }, mapDispatchToProps)
@DragSource('CARD', cardSource, collect)
@DropTarget(['CARD'], cardTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))
class Card extends Component {
    render() {
        const { connectDropTarget } = this.props;
        const { isDragging, connectDragSource } = this.props;
        const cardStyles = Object.assign({}, styles.card, isDragging ? styles.cardDragging : {})
        return connectDropTarget(connectDragSource(
            <div className="card" style={cardStyles}>
                <div className="content">
                    <div className="header">{this.props.item.creator}</div>
                    <div className="meta">{(this.props.item.date) ? this.props.item.date.toDateString() : ''}</div>
                    <div className="description">
                        {this.props.item.body}
                    </div>
                </div>
            </div>
        ))
    }
}


export default Card;