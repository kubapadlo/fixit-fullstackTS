import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI not defined in .env");

    await mongoose.connect(mongoUri);
    console.log("Connected to DB");
  } catch (error: any) {
    throw error;
  }
};

export default connectDB;
