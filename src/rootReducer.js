import { combineReducers } from 'redux';
import sharedReducer from './ducks/sharedReducer';


export default combineReducers({
  shared: sharedReducer,
});