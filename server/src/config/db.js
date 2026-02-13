const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Test connection
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
