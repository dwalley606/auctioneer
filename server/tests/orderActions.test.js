const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Order = require("../models/Order");
const { createOrder, getOrders } = require("../schemas/actions");

let mongoServer;

describe("Order Actions", () => {
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
    await Order.deleteMany();
  });
  it("should create a new order", async () => {
    const newOrder = {
      buyerId: new mongoose.Types.ObjectId(), // Convert string to ObjectId
      productId: new mongoose.Types.ObjectId(), // Convert string to ObjectId
      amount: 1,
      paymentId: new mongoose.Types.ObjectId(), // Convert string to ObjectId
    };

    const createdOrder = await createOrder(
      newOrder.buyerId,
      newOrder.productId,
      newOrder.amount,
      newOrder.paymentId
    );

    expect(createdOrder).toBeDefined();
    expect(createdOrder.buyer.equals(newOrder.buyerId)).toBe(true);
    expect(createdOrder.product.equals(newOrder.productId)).toBe(true);
    // Add more assertions to validate the created order
  });

  it("should get all orders", async () => {
    const orders = await getOrders();

    expect(orders).toBeDefined();
    expect(Array.isArray(orders)).toBe(true);
    // Add more assertions to validate the retrieved orders
  });
});
