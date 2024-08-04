const mongoose = require("mongoose");

const { Schema } = mongoose;

const subcategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  subcategories: [subcategorySchema],
});

const Category = mongoose.model("Category", categorySchema);

Category.watch().on("change", (data) => console.log(new Date(), data));

module.exports = Category;
