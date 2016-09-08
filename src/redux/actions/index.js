import store from '../store';
import _ from 'lodash';
import ReactRethinkdb from 'react-rethinkdb';
import { findDOMNode } from 'react-dom';
import Immutable, {List, Map} from 'immutable';
window.Immutable = Immutable;
var r = ReactRethinkdb.r;

ReactRethinkdb.DefaultSession.connect({
  host: '192.168.0.4',
  port: 8015,
  path: '/db',
  secure: false,
  db: 'react',
});



export const updateList = (list) => {
  ReactRethinkdb.DefaultSession._connPromise.then(conn => {
    r.table('lists')
      .get(list.id)
      .update(list).run(conn)
  })
}

export const replaceCardsTemporary = (cardArr) => {
  store.dispatch({
    type: 'REPLACE_CARDS_TEMPORARY',
    payload: cardArr
  })
}

export const replaceCards = (cardArr) => {
  var query = r.table('lists').get(cardArr[0].listId).update({
    cards: cardArr
  });
  ReactRethinkdb.DefaultSession.runQuery(query);
}

export const addCardToList = (card, listId) => {
  var query = r.table('lists').get(listId).update({
    cards: r.row('cards').append(Object.assign({}, card, { listId: listId }))
  });
  ReactRethinkdb.DefaultSession.runQuery(query);
}

export const moveCard = (props, monitor, component) => {
  const state = store.getState();
  const dragIndex = monitor.getItem().index;
  const dragListId = monitor.getItem().item.listId
  const hoverIndex = props.index;
  const hoverListId = props.item.listId;
  if (dragIndex === hoverIndex && dragListId === hoverListId) {
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
  const lists = List(state.lists);
  if (dragListId == hoverListId) {
    const list = lists.find((list, index) => (list.id === hoverListId));
    const cards = List(list.cards);
    const step1 = cards.update(dragIndex, () => cards.get(hoverIndex));
    const newArr = step1.update(hoverIndex, () => cards.get(dragIndex))
    replaceCardsTemporary(newArr.toJS());
    monitor.getItem().index = hoverIndex;
  } else {
    const listACards = List(lists.find((list, index) => (list.id === dragListId)).cards);
    const listBCards = List(lists.find((list, index) => (list.id === hoverListId)).cards);
    if (listACards.get(dragIndex)  &&
      listBCards.find((card) => (card.id === listACards.get(dragIndex).id)) === undefined) {
      const newCard = Object.assign({}, listACards.get(dragIndex), { listId: hoverListId })
      replaceCardsTemporary(listACards.delete(dragIndex).toJS());
      
      replaceCardsTemporary(listBCards.insert(hoverIndex, newCard).toJS());
      monitor.getItem().index = hoverIndex;
      monitor.getItem().item = newCard;
    }

  }



  //console.log(dragIndex, dragListId, hoverIndex, hoverListId);

  /*if(dragListId == hoverListId) {
      const { cards } = _.find(state.lists, {id: dragListId});
      const newArray = swapIndices(cards, dragIndex, hoverIndex);
      replaceCards(newArray);
      monitor.getItem().index = hoverIndex;
  }else {
    const dragList = _.find(state.lists, {id: dragListId});
    const hoverList = _.find(state.lists, {id: hoverListId});
    dragList.cards.splice(dragIndex, 1);
    hoverList.cards.splice(hoverIndex, 0, {...monitor.getItem().item, listId:hoverListId});
  }*/
}


export const connectToLists = () => {
  //fetching initial data
  ReactRethinkdb.DefaultSession
    .runQuery(r.table('lists'))
    .then((cursor, err) => {
      if (err) throw err;
      cursor.toArray((err, result) => {
        if (err) throw err;
        store.dispatch({
          type: 'SET_LISTS',
          payload: result
        })
      });
    })

  //Connectig to changefeed
  ReactRethinkdb.DefaultSession._connPromise.then(conn => {
    r.table('lists').changes().run(conn, function (err, cursor) {
      if (err) throw err;
      cursor.each(function (err, row) {
        if (err) throw err;
        store.dispatch({
          type: 'CHANGEFEED_LIST',
          payload: row
        })
      });
    });
  });
  return {
    type: 'CONNECTING_TO_LISTS'
  }
}