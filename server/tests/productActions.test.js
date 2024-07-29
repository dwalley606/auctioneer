const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Product = require("../models/Product");
const { createProduct, getProducts } = require("../schemas/actions");

let mongoServer;

describe("Product Actions", () => {
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
    await Product.deleteMany();
  });

  it("should create a new product", async () => {
    const newProduct = {
      name: "Test Product",
      description: "This is a test product",
      price: 100,
      quantity: 10,
      categoryId: new mongoose.Types.ObjectId(), // Create a new instance of ObjectId
      sellerId: new mongoose.Types.ObjectId(), // Create a new instance of ObjectId
    };

    const createdProduct = await createProduct(
      newProduct.name,
      newProduct.description,
      newProduct.price,
      newProduct.quantity,
      newProduct.categoryId,
      newProduct.sellerId
    );

    expect(createdProduct).toBeDefined();
    expect(createdProduct.name).toBe(newProduct.name);
    // Add more assertions as needed
  });

  it("should retrieve all products", async () => {
    const products = await getProducts();

    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    // Add more assertions to validate the retrieved products
  });
});
