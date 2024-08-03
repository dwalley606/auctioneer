import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user/userSlice";
import cartReducer from "./cart/cartSlice";
import auctionReducer from "./auction/auctionSlice";

const userPersistConfig = {
  key: "user",
  storage,
  version: 1,
};

const cartPersistConfig = {
  key: "cart",
  storage,
  version: 1,
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    cart: persistedCartReducer,
    auction: auctionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

store.subscribe(() => {
  console.log("Store state:", store.getState());
});

export const persistor = persistStore(store);

console.log("Initial store state:", store.getState());

export default store;
