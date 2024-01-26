import { combineReducers } from 'redux';
import userReducer from './userSlice';
import OrdersReducer from './OrdersSlice';
 
export default combineReducers({
  user: userReducer,
  orders: OrdersReducer
});