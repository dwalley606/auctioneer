const { MongoClient } = require("mongodb");

async function pollForChanges(io) {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("mern-shopping");
    const collection = database.collection("products");

    let lastCheck = new Date();

    setInterval(async () => {
      const changes = await collection
        .find({ updatedAt: { $gte: lastCheck } })
        .toArray();
      if (changes.length > 0) {
        console.log("Changes detected:", changes);
        io.emit("bidChange", changes);
        console.log(
          "Emitted bidChange event. Connected clients:",
          io.engine.clientsCount
        );
        lastCheck = new Date();
      }
    }, 5000); // Poll every 5 seconds
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    setTimeout(() => {
      console.log("Retrying MongoDB connection...");
      pollForChanges(io);
    }, 5000); // Retry after 5 seconds
  } finally {
    process.on("exit", () => {
      client.close();
    });
  }
}

module.exports = pollForChanges;
