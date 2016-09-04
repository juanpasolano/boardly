import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import { DropTarget, DragSource } from 'react-dnd';

class Card extends Component {
    render() {
        const { canDrop, isOver, connectDropTarget } = this.props;
        const { isDragging, connectDragSource } = this.props;
        const opacity = isDragging ? 0.5 : 1;
        return connectDropTarget(connectDragSource(
            <div className="card" style={{ opacity }}>
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
    drop: function (props, monitor) {
        console.log(monitor.isOver(), monitor.isOver({shallow: false}), monitor.didDrop(), monitor.getDropResult());
    },
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

export default DragSource('CARD', cardSource, collect)(DropTarget(['CARD'], cardTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))(Card));