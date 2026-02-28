const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const User = require("./src/models/User.model");

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log("✅ MongoDB Connected\n");

    // Check all users
    const users = await User.find({}).select("name email role");

    console.log("📊 Users in database:");
    console.log("=".repeat(50));
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log("");
    });

    console.log(`Total users: ${users.length}`);
    console.log("\n🔐 Try logging in with:");
    console.log("   Admin: admin@hostel.com / Admin@123");
    console.log("   Manager: manager@hostel.com / Manager@123");
    console.log("   Student: student@hostel.com / Student@123");

    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
