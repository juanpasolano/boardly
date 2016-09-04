import store from '../store';
import ReactRethinkdb from 'react-rethinkdb';
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