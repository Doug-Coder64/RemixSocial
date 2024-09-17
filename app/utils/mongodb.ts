import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/";

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw new Error("Failed to connect to MongoDB");
  }
};
