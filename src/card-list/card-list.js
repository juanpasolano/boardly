import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';

const style = {
  height: '12rem',
  width: '12rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
  background: 'black',
};

class CardList extends Component {
    render() {
        const { canDrop, isOver, connectDropTarget } = this.props;
        const isActive = canDrop && isOver;
        return connectDropTarget(
            <div style={style}>I am a card list</div>
        )
    }
}

const dustbinTarget = {
  drop: function(props, monitor) {
    props.onDrop(monitor.getItem());
  }
};

export default DropTarget(['CARD'], dustbinTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))(CardList);