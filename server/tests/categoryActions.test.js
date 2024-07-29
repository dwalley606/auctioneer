const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Category = require("../models/Category");
const { createCategory, getCategories } = require("../schemas/actions");

let mongoServer;

describe("Category Actions", () => {
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
    await Category.deleteMany();
  });
  it("should create a new category", async () => {
    const newCategory = {
      name: "Test Category",
    };

    const createdCategory = await createCategory(newCategory.name);

    expect(createdCategory).toBeDefined();
    expect(createdCategory.name).toBe(newCategory.name);
    // Add more assertions to validate the created category
  });

  it("should get all categories", async () => {
    const categories = await getCategories();

    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
    // Add more assertions to validate the retrieved categories
  });
});
