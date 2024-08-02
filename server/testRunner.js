require("dotenv").config(); // Ensure this line is at the top if you're using environment variables

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { signup, login } = require("./schemas/actions");
const User = require("./models/User");

// MongoDB Connection
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mern-shopping"
);
mongoose.connection.on("connected", async () => {
  console.log("Mongoose connected to MongoDB");

  try {
    await testSignupAndLogin();
    await testPasswordHashing();
    await testPasswordComparison();
    await testUserModel();
    await testTokenGeneration();
    console.log("All tests completed successfully");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
  process.exit(1);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

// Generate a new user for signup
function generateNewUser() {
  const timestamp = Date.now();
  return {
    username: `testuser_${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: "password123",
  };
}

// Test Signup and Login
async function testSignupAndLogin() {
  console.log("Running testSignupAndLogin...");

  const newUser = generateNewUser();

  // Test Signup
  const signupResult = await signup(
    newUser.username,
    newUser.email,
    newUser.password
  );
  console.log("Signup result:", signupResult);

  // Test Login
  const loginResult = await login(newUser.email, newUser.password);
  console.log("Login result:", loginResult);
}

// Test Password Hashing
async function testPasswordHashing() {
  console.log("Running testPasswordHashing...");

  const password = "your_test_password";
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hashedPassword);

  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log("Password match:", isMatch);
}

// Test Password Comparison
async function testPasswordComparison() {
  console.log("Running testPasswordComparison...");

  const plainPassword = "password123";
  const hashedPassword =
    "$2a$10$iUWUVjY8HWtAc0RLBM88xOTyvVI.Kp42x78.E5je/oKfiAbY9b2O."; // Use the hashed password from your signup result

  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log("Password match:", isMatch);
}

// Test User Model
async function testUserModel() {
  console.log("Running testUserModel...");

  // Create a test user
  const testUser = new User({
    username: "testuser",
    email: "test1@example.com",
    password: "password123",
  });

  await testUser.save();
  console.log("Test user saved:", testUser);

  // Find the user by email
  const foundUser = await User.findOne({ email: "test1@example.com" });
  console.log("Found user:", foundUser);
}

// Test Token Generation
function testTokenGeneration() {
  console.log("Running testTokenGeneration...");

  const user = { id: "testUserId" };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
  console.log("Generated token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
  } catch (error) {
    console.error("Token verification error:", error);
  }
}
