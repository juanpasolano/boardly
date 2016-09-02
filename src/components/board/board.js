import React, { Component } from 'react';
import { connect } from 'react-redux'
import { connectToLists, updateList, addCardToList } from '../../redux/actions'
import CardList from '../card-list/card-list';
import _ from 'lodash';


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

  _onNewCard(listId, refs) {
    let {creator, body} = refs;
    let card = {
      creator: creator.value,
      body: body.value,
      date: new Date(),
      id: new Date().getTime(),
      listId: listId
    }
    this.props.addCardToList(card, listId);
  }

  _renderCardLists(lists) {
    if (lists) {
      return lists.map(item =>
        <CardList
          accepts={['CARD']}
          key={item.id}
          list={item}
          onDrop={(droppedCard) => this.handleDrop(droppedCard, item) }
          onNewCard={this._onNewCard.bind(this, item.id) } />
      )
    }
  }
  _deleteCardFromCurrentList(droppedCard) {
    let list = _.find(_.cloneDeep(this.props.lists), { id: droppedCard.listId })
    let cards = _.remove(list.cards, card => card.id === droppedCard.id);
    this.props.updateList(list);
  }

  handleDrop(droppedCard, targetList) {
    this._deleteCardFromCurrentList(droppedCard);
    if(!_.find(targetList.cards, {id: droppedCard.id})){
      this.props.addCardToList(droppedCard, targetList.id);
    }
  }

  render() {
    return (
      <div>
        {this._renderCardLists(this.props.lists) }
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
