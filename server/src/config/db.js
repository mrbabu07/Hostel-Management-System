const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Test connection
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error("\n⚠️  Possible issues:");
    console.error("   1. MongoDB Atlas cluster might be paused (check your Atlas dashboard)");
    console.error("   2. Network connectivity issue");
    console.error("   3. Incorrect connection string");
    console.error("   4. IP address not whitelisted in MongoDB Atlas\n");
    process.exit(1);
  }
};

module.exports = connectDB;
