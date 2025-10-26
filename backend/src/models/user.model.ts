import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "../types/user.types";
import Joi from "joi";

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
  role: {
    type: String,
    enum: ["user", "admin", "worker"],
    default: "user"
  }
});

const User : Model<IUser> = mongoose.model<IUser>("User", userSchema);

// do walidacji danych ktore przychodzą do backendu
export const userLoginValidationSchema = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  })
}

export const userRegisterValidationSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  })
}

export default User
