import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth/authSlice";
import userReducer from "./user/userSlice";
import cartReducer from "./cart/cartSlice";
import auctionReducer from "./auction/auctionSlice";
import productsReducer from "./products/productsSlice";
import categoriesReducer from "./categories/categoriesSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  cart: cartReducer,
  auction: auctionReducer,
  products: productsReducer,
  categories: categoriesReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["user", "auth", "auction"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

store.subscribe(() => {
  console.log("Store state:", store.getState());
});

export default store;
