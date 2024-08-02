const mongoose = require("mongoose");

const { Schema } = mongoose;

const feedbackSchema = new Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
  },
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    // Ensure that the product reference is included if needed
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
