import {
    // DELETE_FRIENDS,
    // ADD_FRIENDS,
    // UPDATE_FRIENDS,
    SET_FRIENDS
} from '../actions/friends';




const initialState = {
    friendsList: []
};


export default (state = initialState, action) => {
    switch (action.type) {
      case SET_FRIENDS:
        return {
          ...initialState, 
          friendsList: action.friendsList
        };
    }
    return state;
};
  


