import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { gql } from "@apollo/client";
import { client } from "../../App";
import { getAuthHeaders } from "../../utils/auth";

// GraphQL queries and mutations
const GET_AUCTIONS = gql`
  query GetAuctions {
    auctions {
      id
      startTime
      endTime
      highestBid
      highestBidUser {
        id
        username
      }
      product {
        id
        name
        description
        image
      }
      status
    }
  }
`;

const CREATE_AUCTION = gql`
  mutation StartAuction($input: StartAuctionInput!) {
    startAuction(input: $input) {
      id
      startTime
      endTime
      highestBid
      highestBidUser {
        id
        username
      }
      product {
        id
        name
        description
        image
      }
      status
    }
  }
`;

const PLACE_BID = gql`
  mutation PlaceBid($auctionId: ID!, $amount: Float!) {
    placeBid(auctionId: $auctionId, amount: $amount) {
      id
      amount
      user {
        id
        username
      }
    }
  }
`;

// Initial state
const initialState = {
  auctions: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchAuctions = createAsyncThunk(
  "auction/fetchAuctions",
  async (_, thunkAPI) => {
    try {
      console.log("Fetching auctions...");
      const { data } = await client.query({
        query: GET_AUCTIONS,
        context: {
          headers: getAuthHeaders(),
        },
      });
      console.log("Auctions fetched:", data.auctions);
      return data.auctions;
    } catch (error) {
      console.error("Error fetching auctions:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const startAuction = createAsyncThunk(
  "auction/startAuction",
  async (auctionData, { rejectWithValue }) => {
    try {
      console.log("Starting auction with data:", auctionData);
      const input = {
        productId: auctionData.productId,
        startTime: auctionData.startTime,
        endTime: auctionData.endTime,
        startingPrice: parseFloat(auctionData.startingPrice),
        status: "active",
      };

      const { data } = await client.mutate({
        mutation: CREATE_AUCTION,
        variables: { input },
        context: {
          headers: getAuthHeaders(),
        },
      });

      console.log("Auction started:", data.startAuction);
      return data.startAuction;
    } catch (error) {
      console.error("Error starting auction:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const placeBid = createAsyncThunk(
  "auction/placeBid",
  async ({ auctionId, amount }, { rejectWithValue }) => {
    try {
      console.log("Placing bid on auction:", auctionId, "Amount:", amount);
      const { data } = await client.mutate({
        mutation: PLACE_BID,
        variables: { auctionId, amount },
        context: {
          headers: getAuthHeaders(),
        },
      });
      console.log("Bid placed:", data.placeBid);
      return { auctionId, bid: data.placeBid };
    } catch (error) {
      console.error("Error placing bid:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Auction slice
const auctionSlice = createSlice({
  name: "auction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuctions.pending, (state) => {
        console.log("Fetching auctions started...");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuctions.fulfilled, (state, action) => {
        console.log("Fetching auctions successful:", action.payload);
        state.loading = false;
        state.auctions = action.payload;
      })
      .addCase(fetchAuctions.rejected, (state, action) => {
        console.error("Fetching auctions failed:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(startAuction.pending, (state) => {
        console.log("Starting auction...");
        state.loading = true;
        state.error = null;
      })
      .addCase(startAuction.fulfilled, (state, action) => {
        console.log("Auction started successfully:", action.payload);
        state.loading = false;
        state.auctions.push(action.payload);
      })
      .addCase(startAuction.rejected, (state, action) => {
        console.error("Starting auction failed:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(placeBid.pending, (state) => {
        console.log("Placing bid...");
        state.loading = true;
        state.error = null;
      })
      .addCase(placeBid.fulfilled, (state, action) => {
        console.log("Bid placed successfully:", action.payload);
        state.loading = false;
        const { auctionId, bid } = action.payload;
        const auction = state.auctions.find((a) => a.id === auctionId);
        if (auction) {
          if (bid.amount > auction.highestBid) {
            auction.highestBid = bid.amount;
            auction.highestBidUser = bid.user;
          }
        }
      })
      .addCase(placeBid.rejected, (state, action) => {
        console.error("Placing bid failed:", action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectAuctions = (state) => state.auction.auctions;

export default auctionSlice.reducer;
