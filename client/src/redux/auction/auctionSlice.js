import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auctions: [],
};

const auctionSlice = createSlice({
  name: "auction",
  initialState,
  reducers: {
    startAuction: (state, action) => {
      state.auctions.push(action.payload);
    },
    placeBid: (state, action) => {
      const { productId, bidAmount } = action.payload;
      const auction = state.auctions.find((a) => a.productId === productId);
      if (auction && bidAmount > auction.highestBid) {
        auction.highestBid = bidAmount;
      }
    },
  },
});

export const { startAuction, placeBid } = auctionSlice.actions;

export const selectAuctions = (state) => state.auction.auctions;

export default auctionSlice.reducer;
