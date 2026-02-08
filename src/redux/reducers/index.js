import { combineReducers } from 'redux';
import authReducer from './authReducer';
import mediaReducer from './mediaReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  media: mediaReducer,
});

export default rootReducer;
