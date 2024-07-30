const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/User");
const { signup, login, getUsers } = require("../schemas/actions");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "testsecret";

// Mocking the User model
jest.mock("../models/User");
jest.mock("jsonwebtoken");

let mongoServer;

describe("User Actions", () => {
  const mockUser = {
    id: "123",
    email: "testuser@example.com",
    username: "testuser",
    password: "hashedPassword123",
  };

  const mockToken = "mockToken123";

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Mock the database call to find a user
    User.findOne.mockResolvedValue(mockUser);

    // Mock bcrypt.compare to always return true
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    // Mock JWT generation to return a known token
    jwt.sign = jest.fn().mockReturnValue(mockToken);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  it("should signup a new user", async () => {
    const firstName = "new";
    const lastName = "user";
    const email = "newuser@example.com";
    const password = "password123";

    const hashedPassword =
      "$2a$10$lcYu5FbwLQ1L0ehdnVEzjeqTVoS/yP5IJWROs9fRqLgtlUzm73kZa"; // Expected hashed password

    const newUser = { firstName, lastName, email, password: hashedPassword }; // Ensure password is hashed

    User.create = jest.fn().mockResolvedValue(newUser);

    const result = await signup(firstName, lastName, email, password);

    expect(User.create).toHaveBeenCalledWith(newUser);
  });

  it("should return a token and user when credentials are correct", async () => {
    const email = "testuser@example.com";
    const password = "password123";

    const result = await login(email, password);

    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    expect(result).toEqual({ token: mockToken, user: mockUser });
  });

  it("should throw an error if user is not found", async () => {
    User.findOne.mockResolvedValue(null); // No user found

    const email = "nonexistent@example.com";
    const password = "password123";

    await expect(login(email, password)).rejects.toThrow("Invalid credentials");
  });

  it("should throw an error if password is incorrect", async () => {
    bcrypt.compare = jest.fn().mockResolvedValue(false); // Password mismatch

    const email = "testuser@example.com";
    const password = "wrongpassword";

    await expect(login(email, password)).rejects.toThrow("Invalid credentials");
  });
});

// Existing imports and setup code
