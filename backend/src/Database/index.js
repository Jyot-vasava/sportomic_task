// src/database/index.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URL;

    if (!mongoUri) {
      throw new Error("MONGO_URL is not defined in .env file. Please add it!");
    }

    const dbName = process.env.DB_NAME || "sportomic";

    const connectionInstance = await mongoose.connect(`${mongoUri}/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`\n🎉 MongoDB connected successfully!`);
    console.log(`Database: ${connectionInstance.connection.name}`);
    console.log(`Host: ${connectionInstance.connection.host}\n`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
