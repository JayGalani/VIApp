import { ADD_MEDIA, SET_MEDIA_LIST, DELETE_MEDIA, LOGOUT } from '../actions/types';

const initialState = {
  list: [],
};

const mediaReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MEDIA:
      return { ...state, list: [action.payload, ...state.list] };
    case SET_MEDIA_LIST:
      return { ...state, list: action.payload };
    case DELETE_MEDIA:
      return {
        ...state,
        list: state.list.filter((item) => item.id !== action.payload),
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default mediaReducer;
