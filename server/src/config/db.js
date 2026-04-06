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
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Test connection
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error("\n⚠️  Possible issues:");
    console.error("   1. MongoDB Atlas cluster might be paused");
    console.error("   2. Network connectivity issue");
    console.error("   3. Incorrect connection string in .env");
    console.error("   4. IP address not whitelisted in MongoDB Atlas");
    console.error("   5. Database credentials are incorrect\n");
    console.warn("⚠️  Server will continue running without database connection\n");
  }
};

module.exports = connectDB;
