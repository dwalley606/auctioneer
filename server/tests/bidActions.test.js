const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Bid = require("../models/Bid");
const { createBid, getBids } = require("../schemas/actions");

let mongoServer;

describe("Bid Actions", () => {
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

  it("should create new bid", async () => {
    const newBid = {
      auction: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(),
      amount: 100,
      timestamp: new Date(),
    };

    const createdBid = await createBid(
      newBid.auction,
      newBid.user,
      newBid.amount,
      newBid.timestamp
    );

    expect(createdBid).toHaveProperty("_id");
    expect(createdBid.amount).toBe(newBid.amount);
    expect(new Date(createdBid.timestamp).getTime()).toBeCloseTo(
      new Date(newBid.timestamp).getTime(),
      10
    ); // Allow for a small difference in timestamps
  });

  it("should get bids", async () => {
    const bids = await getBids();
    expect(bids).toHaveLength(0);
  });
});
