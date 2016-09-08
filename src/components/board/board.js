import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { connectToLists, updateList, addCardToList } from '../../redux/actions'
import CardList from '../card-list/card-list';
import Header from './header';
import _ from 'lodash';

const propTypes = {
    lists: PropTypes.array,
    connectToLists: PropTypes.func,
    updateList: PropTypes.func,
    addCardToList: PropTypes.func,
}

/**
 * Container settings
 */
const mapStateToProps = (state) => {
  return {
    lists: state.lists
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    connectToLists,
    updateList,
    addCardToList
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@DragDropContext(HTML5Backend)
export class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        list: null
      },
      lists: null
    }
  }
  componentWillMount() {
    this.props.connectToLists();
  }

  _onNewCard(card) {
    this.props.addCardToList(card, card.listId);
  }
  _onSubmitEditTitle(listId, title) {
    this.props.updateList({name: title, id:listId});
  }
  _deleteCardFromCurrentList(droppedCard) {
    let list = _.find(_.cloneDeep(this.props.lists), { id: droppedCard.listId })
    _.remove(list.cards, card => card.id === droppedCard.id); 
    this.props.updateList(list);
  }

  handleDrop(droppedCard, targetList) {
    if (droppedCard.listId !== targetList.id && !_.find(targetList.cards, { id: droppedCard.id })) {
      this._deleteCardFromCurrentList(droppedCard);
      this.props.addCardToList(droppedCard, targetList.id);
    }
  }

  _renderCardLists(lists) {
    if (lists) {
      return lists.map(item =>
        <CardList
          accepts={['CARD']}
          key={item.id}
          list={item}
          onDrop={(droppedCard) => this.handleDrop(droppedCard, item) }
          onNewCard={this._onNewCard.bind(this)}
          onSubmitEditTitle={this._onSubmitEditTitle.bind(this, item.id)}
        />
      )
    }
  }

  render() {
    return (
      <div>
        <Header/>
        <div className="board" style={{padding: '2rem'}}>
          {this._renderCardLists(this.props.lists) }
        </div>
      </div>
    );
  }
}

Board.propTypes = propTypes;

export default Board;
