// src/store.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import apiSlice from "./apiSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};
 
const reducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);
 
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (middleware) =>
    middleware({ serializableCheck: false }).concat(apiSlice.middleware),
  devTools: true,
});

export const persistor = persistStore(store);
