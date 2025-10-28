import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set in environment");

  await mongoose.connect(uri, {
    // options are fine with mongoose v6+
  });
  console.log("✅ MongoDB connected");
};

export default connectDB;
