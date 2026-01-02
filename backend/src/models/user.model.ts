import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "../types/user.types";
import Joi from "joi";

const userSchema: Schema<IUser> = new Schema({
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
    enum: ["student", "technician", "admin"],
    default: "student"
  },
  firstName: {
    type: String,
    required: [true, "firstName is required"],
  },
  lastName: {
    type: String,
    required: [true, "lastName is required"],
  },
  location: {
    dorm: {type: String},
    room: {type: String}
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
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid("student", "technician", "admin").default("student"),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    location: Joi.object({
      dorm: Joi.string(),
      room: Joi.string()
    }).when("role", {
      is: "student",
      then: Joi.object({
        dorm: Joi.string().required(),
        room: Joi.string().required(),
      }).required(),
      otherwise: Joi.forbidden(), // Technicy / Admini nie powinni mieć pola room
    }),
  })
}

export default User
