const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
