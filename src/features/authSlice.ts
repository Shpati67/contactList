import { createSelector, createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      const { jwt } = action.payload;
      state.token = jwt;
    },
    clearToken(state) {
      state.token = null;
    },
    logOut: () => initialState,
  },
});

const selectSelf = (state: any) => state.auth;

export const { setToken, clearToken, logOut } = authSlice.actions;

export const selectToken = createSelector(selectSelf, (state) => state.token);

export default authSlice.reducer;
