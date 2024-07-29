const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Auction = require("../models/Auction");
const { createAuction, getAuctions } = require("../schemas/actions");

let mongoServer;

describe("Auction Actions", () => {
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
    await Auction.deleteMany();
  });

  it("should create a new auction", async () => {
    const newAuction = {
      product: new mongoose.Types.ObjectId(),
      startDate: new Date(),
      endDate: new Date(),
      price: 100,
      status: "active",
    };

    const createdAuction = await createAuction(
      newAuction.product,
      newAuction.startDate,
      newAuction.endDate,
      newAuction.price,
      newAuction.status
    );

    expect(createdAuction.product).toBe(newAuction.product);
    expect(createdAuction.status).toBe(newAuction.status);
  });

  it("should get all auctions", async () => {
    const auctions = await getAuctions();
    expect(auctions).toBeInstanceOf(Array);
  });
});
