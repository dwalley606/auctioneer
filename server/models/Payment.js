const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  method: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
