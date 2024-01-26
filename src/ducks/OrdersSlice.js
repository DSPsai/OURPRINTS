import { createSlice } from '@reduxjs/toolkit';
import OrderService from 'services/repo/OrderService';

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    data: null,
    error: null,
    isLoading: true
  },
  reducers: {
    fetchOrders(state, action) {
      if (action.payload.error) {
        state.error = action.payload.error;
      } else {
        state.data = action.payload.data;
      }
      state.isLoading = action.payload.isLoading;
    }
  }
});

export const { fetchOrders } = ordersSlice.actions;

export default ordersSlice.reducer;

export function fetchOrdersThunk() {
  return async function (dispatch) {
    dispatch(fetchOrders({ isLoading: true }));
    try {
      const res = await OrderService.getPending();
      dispatch(fetchOrders({ data: res.data }));
    } catch (err) {
      console.log(err);
      dispatch(fetchOrders({ error: err.message }));
    }
  };
}
