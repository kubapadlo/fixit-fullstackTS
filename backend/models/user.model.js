const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "User is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  passwordHash: {
    type: String,
    required: [true, "PasswordHash is required"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
