const mongoose = require("mongoose");

const { Schema } = mongoose;

const subcategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

Subcategory.watch().on("change", (data) => console.log(new Date(), data));

module.exports = Subcategory;
