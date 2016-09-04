import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import { DropTarget, DragSource } from 'react-dnd';

const styles = {
    card: {
        marginBottom: '-0.3rem',
    },
    cardDragging : {
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
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        if (dragIndex === hoverIndex) {
            return;
        }
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }
        props.moveCard(dragIndex, hoverIndex, monitor);
    }
};

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