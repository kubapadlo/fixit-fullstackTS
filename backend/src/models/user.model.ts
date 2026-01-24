import mongoose, { Schema, Model } from "mongoose";

interface IUser {
  id?: string; 
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  role: "student" | "technician" | "admin";
  location?: {
    dorm: string;
    room: string;
  };
}

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

export default User;