import { createSlice } from '@reduxjs/toolkit';
import ProfileService from 'services/repo/ProfileService';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    error: null,
    isLoading: true
  },
  reducers: {
    fetchUser(state, action) {
      if (action.payload.error) {
        state.error = action.payload.error;
      } else {
        state.data = action.payload.data;
      }
      state.isLoading = action.payload.isLoading;
    }
  }
});

export const { fetchUser } = userSlice.actions;

export default userSlice.reducer;

export function fetchUserThunk() {
  return async function (dispatch) {
    dispatch(fetchUser({ isLoading: true }));
    try {
      const res = await ProfileService.get();
      dispatch(fetchUser({ data: res.data }));
    } catch (err) {
      console.log(err);
      dispatch(fetchUser({ error: err.message }));
    }
  };
}
