const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Feedback = require("../models/Feedback");
const { createFeedback, getFeedbacks } = require("../schemas/actions");

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
    await Feedback.deleteMany();
  });
  it("should create new feedback", async () => {
    const newFeedback = {
      fromUser: new mongoose.Types.ObjectId(),
      toUser: new mongoose.Types.ObjectId(),
      product: new mongoose.Types.ObjectId(),
      rating: 5,
      comment: "Great product",
    };

    const createdFeedback = await createFeedback(
      newFeedback.fromUser,
      newFeedback.toUser,
      newFeedback.product,
      newFeedback.rating,
      newFeedback.comment
    );

    expect(createdFeedback).toBeDefined();
    expect(createdFeedback.rating).toBe(5);
    expect(createdFeedback.comment).toBe("Great product");
  });

  test("Get Feedbacks", async () => {
    const feedbacks = await getFeedbacks();
    expect(feedbacks).toBeDefined();
    expect(feedbacks).toBeInstanceOf(Array);
  });
});
