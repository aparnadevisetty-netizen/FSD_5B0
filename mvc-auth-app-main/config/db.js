import mongoose from "mongoose";

const connectDB = async (mongoUri, dbName) => {
  if (!mongoUri) {
    console.log("No MONGO_URI provided");
    return;
  }
  try {
    await mongoose.connect(mongoUri, {
      dbName: dbName,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

export default connectDB;
