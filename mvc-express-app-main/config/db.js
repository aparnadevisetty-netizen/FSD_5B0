import mongoose from "mongoose";

const connectDB = (mongoUri) => {
  if (!mongoUri) {
    console.log("No MONGO_URI provided");
    return;
  }
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("Problem while connecting mongoDB", err);
    });
};

export default connectDB;
