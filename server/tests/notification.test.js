const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Notification = require("../models/Notification");
const { createNotification, getNotifications } = require("../schemas/actions");

let mongoServer;

describe("Notification Actions", () => {
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
    await Notification.deleteMany();
  });

  it("should create a notification", async () => {
    const newNotification = {
      user: new mongoose.Types.ObjectId(),
      message: "Test Message",
      read: false,
      timestamp: new Date(),
    };

    const createdNotification = await createNotification(
      newNotification.user,
      newNotification.message,
      newNotification.read,
      newNotification.timestamp
    );

    expect(createdNotification.user).toEqual(newNotification.user);
    expect(createdNotification.message).toEqual(newNotification.message);
    expect(createdNotification.read).toEqual(newNotification.read);
    expect(new Date(createdNotification.timestamp).getTime()).toBeCloseTo(
      new Date(newNotification.timestamp).getTime(),
      10
    ); // Allow for a small difference in timestamps
  });
});
