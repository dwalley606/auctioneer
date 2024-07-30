const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Payment = require("../models/Payment");
const { createPayment, getPayments } = require("../schemas/actions");

let mongoServer;

describe("Payment Actions", () => {
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
    await Payment.deleteMany();
  });

  it("should create a payment", async () => {
    const payment = {
      order: new mongoose.Types.ObjectId(),
      method: "credit card",
      status: "pending",
      transactionId: "1234567890",
    };

    const createdPayment = await createPayment(
      payment.order,
      payment.method,
      payment.status,
      payment.transactionId
    );

    expect(createdPayment).toHaveProperty("_id");
    expect(createdPayment.order).toBe(payment.order);
    expect(createdPayment.method).toBe(payment.method);
    expect(createdPayment.status).toBe(payment.status);
    expect(createdPayment.transactionId).toBe(payment.transactionId);
  });
});
