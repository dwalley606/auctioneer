const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bidSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Ensure this references the User schema
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

module.exports = mongoose.model("Bid", bidSchema);
