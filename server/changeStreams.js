const { MongoClient } = require("mongodb");

async function watchCollection(io) {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("mern-shopping");
    const collection = database.collection("products");

    const changeStream = collection.watch();

    console.log("Listening for changes on products collection...");

    changeStream.on("change", (change) => {
      console.log("Change detected:", change);
      io.emit("bidChange", change);
      console.log(
        "Emitted bidChange event. Connected clients:",
        io.engine.clientsCount
      );
    });

    changeStream.on("error", (err) => {
      console.error("Error in change stream:", err);
      setTimeout(() => {
        console.log("Reconnecting to change stream...");
        watchCollection(io);
      }, 5000); // Retry after 5 seconds
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    setTimeout(() => {
      console.log("Retrying MongoDB connection...");
      watchCollection(io);
    }, 5000); // Retry after 5 seconds
  } finally {
    process.on("exit", () => {
      client.close();
    });
  }
}

module.exports = watchCollection;
