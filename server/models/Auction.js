// server/models/Auction.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const auctionSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  bids: [
    {
      amount: {
        type: Number,
        required: true,
      },
      bidder: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  startingPrice: {
    type: Number,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "completed", "cancelled"],
    default: "active",
  },
});

const Auction = mongoose.model("Auction", auctionSchema);

module.exports = Auction;
