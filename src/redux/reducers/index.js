
import { combineReducers } from 'redux';
import _ from 'lodash';

const lists = (state = [], action) => {
  switch (action.type) {

    case 'CONNECTING_TO_LISTS':
      return state;

    case 'SET_LISTS':
      return action.payload;

    case 'CHANGEFEED_LIST':{
      let {new_val, old_val} = action.payload;
      if(new_val === null){ //list was removed
        return state.filter(item => item.id !== old_val.id);
      } else if(old_val === null) { //list was added
        return [...state, new_val];
      }else { //List was modified
        return state.map(item => (item.id === new_val.id) ? new_val : item)
      }
    }

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  lists
})

export default rootReducer