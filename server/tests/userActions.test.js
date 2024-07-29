const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/User");
const { createUser, getUsers } = require("../schemas/actions");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("User Actions", () => {
  it("should create a new user", async () => {
    const newUser = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      // Add other required fields here
    };

    const createdUser = await createUser(newUser);

    expect(createdUser).toBeDefined();
    expect(createdUser.firstName).toBe(newUser.firstName);
    expect(createdUser.lastName).toBe(newUser.lastName);
    // Add other assertions as needed
  });

  it("should retrieve all users", async () => {
    await createUser("testuser1", "testuser1@example.com", "password123");
    await createUser("testuser2", "testuser2@example.com", "password123");

    const users = await getUsers();
    expect(users.length).toBe(2);
    expect(users[0].username).toBe("testuser1");
    expect(users[1].username).toBe("testuser2");
  });
});
