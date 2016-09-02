import React, { Component } from 'react';
import { DragSource } from 'react-dnd';


/**
 * Implements the drag source contract.
 */
const cardSource = {
  beginDrag(props) {
    return {...props.item};
  }
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}


class Card extends Component {
    render () {
        const { isDragging, connectDragSource } = this.props;
        return connectDragSource(
            <div className="card">
                <div className="content">
                <div className="header">{this.props.item.creator}</div>
                <div className="meta">{(this.props.item.date) ? this.props.item.date.toDateString(): ''}</div>
                <div className="description">
                    {this.props.item.body}
                </div>
                </div>
            </div>
        )
    }
}

export default DragSource('CARD', cardSource, collect)(Card);