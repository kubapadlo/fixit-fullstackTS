import mongoose from "mongoose";
import { prisma } from "../../lib/prisma"

export const connectDB = async () => {
  const dbType = process.env.DB_TYPE;

  if (dbType === "mongo") {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI not defined");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } else {
    // Prisma łączy się automatycznie, ale możemy sprawdzić połączenie
    await prisma.$connect();
    console.log("Connected to PostgreSQL via Prisma");
  }
};