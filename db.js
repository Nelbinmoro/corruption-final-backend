const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    setTimeout(() => {
      console.log("Retrying MongoDB connection...");
      connectDB();
    }, 5000);
  }
};

module.exports = connectDB;
