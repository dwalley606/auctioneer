const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_URI || "mongodb+srv://prestonnguyen2001:tyEEXceIsyYq4BSh@cluster0.mcelj0z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = mongoose.connection;
