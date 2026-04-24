import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { apiClient } from "./api-client";

type RootReducerType = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: "root",
  storage,
  blacklist: [apiClient.reducerPath],
};

const rootReducer = combineReducers({
  [apiClient.reducerPath]: apiClient.reducer,
  auth: authReducer,
});

const persistedReducer = persistReducer<RootReducerType>(
  persistConfig,
  rootReducer
);

const reduxPersistActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: reduxPersistActions,
      },
    }).concat(apiClient.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;