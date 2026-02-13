require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const connectDB = require("../config/db");

const seedUsers = async () => {
  try {
    await connectDB();

    // Check if users already exist
    const adminExists = await User.findOne({ email: "admin@hostel.com" });
    const managerExists = await User.findOne({ email: "manager@hostel.com" });
    const studentExists = await User.findOne({ email: "student@hostel.com" });

    if (!adminExists) {
      await User.create({
        name: "Admin User",
        email: "admin@hostel.com",
        password: "Admin@123",
        role: "admin",
        phone: "1234567890",
      });
      console.log("✓ Admin user created");
    } else {
      console.log("✓ Admin user already exists");
    }

    if (!managerExists) {
      await User.create({
        name: "Mess Manager",
        email: "manager@hostel.com",
        password: "Manager@123",
        role: "manager",
        phone: "1234567891",
      });
      console.log("✓ Manager user created");
    } else {
      console.log("✓ Manager user already exists");
    }

    if (!studentExists) {
      await User.create({
        name: "Test Student",
        email: "student@hostel.com",
        password: "Student@123",
        role: "student",
        rollNumber: "STU001",
        roomNumber: "A101",
        phone: "1234567892",
      });
      console.log("✓ Test student created");
    } else {
      console.log("✓ Test student already exists");
    }

    console.log("\n=== Seed Complete ===");
    console.log("\nDefault Users:");
    console.log("Admin: admin@hostel.com / Admin@123");
    console.log("Manager: manager@hostel.com / Manager@123");
    console.log("Student: student@hostel.com / Student@123");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedUsers();
