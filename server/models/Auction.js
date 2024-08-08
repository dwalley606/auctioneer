const mongoose = require("mongoose");
const { Schema } = mongoose;

const auctionSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
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
  startingPrice: {
    type: Number,
    required: true,
  },
  bids: [
    {
      type: Schema.Types.ObjectId,
      ref: "Bid",
    },
  ],
  status: {
    type: String,
    enum: ["active", "completed", "cancelled"],
    required: true,
  },
});

const Auction = mongoose.model("Auction", auctionSchema);

module.exports = Auction;
