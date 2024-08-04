const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    minlength: 5,
  },
  photoUrl: {
    type: String,
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  feedbacks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Feedback",
    },
  ],
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    if (this.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(this.password, saltRounds);
      console.log("Pre-save hook - Hashed Password:", hashedPassword);
      this.password = hashedPassword;
    }
  }
  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  console.log("Comparing password:", password, "with hashed:", this.password);
  try {
    const match = await bcrypt.compare(password, this.password);
    console.log("Password comparison result:", match);
    return match;
  } catch (error) {
    console.error("Error during bcrypt.compare:", error);
    throw error;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
