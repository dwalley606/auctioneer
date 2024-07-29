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

// Existing imports and setup code

describe("User Actions", () => {
  it("should create a new user", async () => {
    const user1 = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    };

    const user2 = {
      firstName: "Alice",
      lastName: "Smith",
      email: "alice.smith@example.com",
      password: "securepassword",
    };

    // Call createUser with individual string values for firstName, lastName, email, and password
    await createUser(
      user1.firstName,
      user1.lastName,
      user1.email,
      user1.password
    );
    await createUser(
      user2.firstName,
      user2.lastName,
      user2.email,
      user2.password
    );

    const users = await getUsers();
    expect(users.length).toBe(2);
    expect(users[0].username).toBe(user1.username);
    expect(users[1].username).toBe(user2.username);
  });
});
