import mongoose, { Schema, Model } from "mongoose";
import { User } from "../types/user.types";

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  passwordHash: {
    type: String,
    required: [true, "passwordHash is required"],
  },
});

const User : Model<User> = mongoose.model<User>("User", userSchema);

export default User
