require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User.model");
const connectDB = require("./src/config/db");

const testLogin = async () => {
  try {
    await connectDB();

    console.log("\n=== Testing Login Credentials ===\n");

    // Test credentials
    const testUsers = [
      { email: "admin@hostel.com", password: "Admin@123", role: "admin" },
      { email: "manager@hostel.com", password: "Manager@123", role: "manager" },
      { email: "student@hostel.com", password: "Student@123", role: "student" },
    ];

    for (const testUser of testUsers) {
      console.log(`Testing ${testUser.role}: ${testUser.email}`);

      const user = await User.findOne({ email: testUser.email }).select(
        "+password",
      );

      if (!user) {
        console.log(`❌ User not found in database!`);
        console.log(`   Run: npm run seed\n`);
        continue;
      }

      const isMatch = await user.comparePassword(testUser.password);

      if (isMatch) {
        console.log(`✅ Password matches!`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive}\n`);
      } else {
        console.log(`❌ Password does NOT match!`);
        console.log(`   Expected: ${testUser.password}`);
        console.log(`   User exists but password is wrong\n`);
      }
    }

    console.log("=== Test Complete ===\n");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

testLogin();
