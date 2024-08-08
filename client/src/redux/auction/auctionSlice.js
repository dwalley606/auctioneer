import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auctions: [],
};

const auctionSlice = createSlice({
  name: "auction",
  initialState,
  reducers: {
    startAuction: (state, action) => {
      const auction = {
        ...action.payload,
        startTime: new Date(action.payload.startTime).toISOString(), // Serialize Date to string
        endTime: new Date(action.payload.endTime).toISOString(), // Serialize Date to string
      };
      state.auctions.push(auction);
    },
    placeBid: (state, action) => {
      const { productId, bidAmount } = action.payload;
      const auction = state.auctions.find((a) => a.product.id === productId);
      if (auction && bidAmount > auction.highestBid) {
        auction.highestBid = bidAmount;
      }
    },
  },
});

export const { startAuction, placeBid } = auctionSlice.actions;

export const selectAuctions = (state) => state.auction.auctions;

export default auctionSlice.reducer;
