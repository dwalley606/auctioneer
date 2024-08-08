const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mern-shopping";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Mongoose connected to MongoDB");
  })
  .catch((err) => {
    console.error("Mongoose connection error:", err);
  });
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});
console.log('MongoDB URI:' , process.env.MONGODB_URI);
module.exports = mongoose.connection; 