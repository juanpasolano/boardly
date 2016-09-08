
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

const lists = (state = [], action) => {
  switch (action.type) {

    case 'CONNECTING_TO_LISTS': {
      console.log('CONNECTING_TO_LISTS');
      return state;
    }

    case 'SET_LISTS':
      return action.payload;

    case 'CHANGEFEED_LIST':{
      let {new_val, old_val} = action.payload;
      if(new_val === null){ //list was removed
        return state.filter(list => list.id !== old_val.id);
      } else if(old_val === null) { //list was added
        return [...state, new_val];
      }else { //List was modified
        return state.map(list => (list.id === new_val.id) ? new_val : list)
      }
    }
    case 'REPLACE_CARDS_TEMPORARY': {
        let listId = action.payload[0].listId;
        return state.map(list => (list.id === listId) ? Object.assign(list, {cards:action.payload}) : list);
    }

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  lists,
  routing: routerReducer
})

export default rootReducer