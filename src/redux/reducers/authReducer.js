import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  CHECK_AUTH_REQUEST,
  CHECK_AUTH_SUCCESS,
  CHECK_AUTH_FAILURE,
  LOGOUT,
  CLEAR_ERROR,
} from '../actions/types';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialAuthChecked: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, isLoading: true, error: null };
    case LOGIN_SUCCESS:
      return { ...state, isLoading: false, isAuthenticated: true, user: action.payload };
    case LOGIN_FAILURE:
      return { ...state, isLoading: false, error: action.payload };
    case CHECK_AUTH_REQUEST:
      return { ...state, isLoading: true };
    case CHECK_AUTH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isInitialAuthChecked: true,
        isAuthenticated: !!action.payload,
        user: action.payload || null,
      };
    case CHECK_AUTH_FAILURE:
      return { ...state, isLoading: false, isInitialAuthChecked: true, isAuthenticated: false, user: null };
    case LOGOUT:
      return { ...state, user: null, isAuthenticated: false };
    case CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

export default authReducer;
