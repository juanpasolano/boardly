
import { combineReducers } from 'redux'

const lists = (state = [], action) => {
  switch (action.type) {
    case 'CONNECTING_TO_LISTS':
      return state;
    case 'SET_LISTS':
      return action.payload;
    case 'CHANGEFEED_LIST':{
      let newList = action.payload.new_val;
      let newState = state.map(item => (item.id === newList.id) ? newList : item)
      return newState
    }
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  lists
})

export default rootReducer