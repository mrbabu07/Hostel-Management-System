// Simple seed script - Run with: node seed-now.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;

console.log("🌱 Starting seed process...\n");
console.log("MongoDB URI:", MONGODB_URI ? "✓ Found" : "❌ Missing");

if (!MONGODB_URI) {
  console.error("\n❌ ERROR: MONGODB_URI not found in .env file!");
  console.log("Make sure server/.env exists with MONGODB_URI");
  process.exit(1);
}

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
    phone: String,
    rollNumber: String,
    roomNumber: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log("\n📡 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB!\n");

    // Hash passwords
    const hashedAdminPass = await bcrypt.hash("Admin@123", 12);
    const hashedManagerPass = await bcrypt.hash("Manager@123", 12);
    const hashedStudentPass = await bcrypt.hash("Student@123", 12);

    // Create users
    const users = [
      {
        name: "Admin User",
        email: "admin@hostel.com",
        password: hashedAdminPass,
        role: "admin",
        phone: "1234567890",
        isActive: true,
      },
      {
        name: "Mess Manager",
        email: "manager@hostel.com",
        password: hashedManagerPass,
        role: "manager",
        phone: "1234567891",
        isActive: true,
      },
      {
        name: "Test Student",
        email: "student@hostel.com",
        password: hashedStudentPass,
        role: "student",
        rollNumber: "STU001",
        roomNumber: "A101",
        phone: "1234567892",
        isActive: true,
      },
    ];

    console.log("👥 Creating users...\n");

    for (const userData of users) {
      try {
        // Check if user exists
        const existing = await User.findOne({ email: userData.email });

        if (existing) {
          console.log(
            `⚠️  ${userData.role.toUpperCase()}: ${userData.email} - Already exists`,
          );
        } else {
          await User.create(userData);
          console.log(
            `✅ ${userData.role.toUpperCase()}: ${userData.email} - Created successfully`,
          );
        }
      } catch (err) {
        console.log(
          `❌ ${userData.role.toUpperCase()}: ${userData.email} - Error: ${err.message}`,
        );
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎉 SEED COMPLETE!");
    console.log("=".repeat(50));
    console.log("\n📋 Default Login Credentials:\n");
    console.log("👨‍💼 ADMIN:");
    console.log("   Email:    admin@hostel.com");
    console.log("   Password: Admin@123\n");
    console.log("👨‍🍳 MANAGER:");
    console.log("   Email:    manager@hostel.com");
    console.log("   Password: Manager@123\n");
    console.log("👨‍🎓 STUDENT:");
    console.log("   Email:    student@hostel.com");
    console.log("   Password: Student@123\n");
    console.log("=".repeat(50));

    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.error("\nFull error:", error);
    process.exit(1);
  }
}

seedDatabase();
