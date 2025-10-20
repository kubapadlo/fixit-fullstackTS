import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "../types/user.types";

const userSchema: Schema<IUser> = new Schema({
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

const User : Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User
