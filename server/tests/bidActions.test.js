const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Bid = require("../models/Bid");
const { createBid, getBids } = require("../schemas/actions");

let mongoServer;

describe("Feedback Actions", () => {
  beforeAll(async () => {
    // Perform any setup tasks before running the tests, such as seeding the database with test data
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Perform any cleanup tasks after running all the tests
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Bid.deleteMany();
  });
});
