const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Import models
const User = require("./src/models/User.model");
const Menu = require("./src/models/Menu.model");
const Notice = require("./src/models/Notice.model");
const Complaint = require("./src/models/Complaint.model");
const Bill = require("./src/models/Bill.model");
const MealPlan = require("./src/models/MealPlan.model");
const Attendance = require("./src/models/Attendance.model");
const Feedback = require("./src/models/Feedback.model");
const Settings = require("./src/models/Settings.model");

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("❌ Error: MONGODB_URI not found in .env file");
  process.exit(1);
}

const reseedDatabase = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected\n");

    console.log("🗑️  Clearing ALL existing data...");
    await User.deleteMany({});
    await Menu.deleteMany({});
    await Notice.deleteMany({});
    await Complaint.deleteMany({});
    await Bill.deleteMany({});
    await MealPlan.deleteMany({});
    await Attendance.deleteMany({});
    await Feedback.deleteMany({});
    await Settings.deleteMany({});
    console.log("✅ All data cleared\n");

    console.log("👥 Creating users with correct passwords...");

    // Create users ONE BY ONE to ensure proper hashing
    const admin = await User.create({
      name: "Admin User",
      email: "admin@hostel.com",
      password: "Admin@123", // Will be hashed by pre-save hook
      role: "admin",
      phone: "1234567890",
      roomNumber: "A-101",
    });
    console.log("✅ Admin created:", admin.email);

    const manager = await User.create({
      name: "Mess Manager",
      email: "manager@hostel.com",
      password: "Manager@123", // Will be hashed by pre-save hook
      role: "manager",
      phone: "1234567891",
      roomNumber: "M-001",
    });
    console.log("✅ Manager created:", manager.email);

    const student1 = await User.create({
      name: "Md Jahedul Islam",
      email: "student@hostel.com",
      password: "Student@123", // Will be hashed by pre-save hook
      role: "student",
      phone: "9876543210",
      roomNumber: "B-201",
      rollNumber: "CS2021001",
    });
    console.log("✅ Student 1 created:", student1.email);

    const student2 = await User.create({
      name: "Alice Johnson",
      email: "alice@hostel.com",
      password: "Student@123",
      role: "student",
      phone: "9876543211",
      roomNumber: "B-202",
      rollNumber: "CS2021002",
    });
    console.log("✅ Student 2 created:", student2.email);

    const student3 = await User.create({
      name: "Bob Smith",
      email: "bob@hostel.com",
      password: "Student@123",
      role: "student",
      phone: "9876543212",
      roomNumber: "B-203",
      rollNumber: "CS2021003",
    });
    console.log("✅ Student 3 created:", student3.email);

    const student4 = await User.create({
      name: "Emma Wilson",
      email: "emma@hostel.com",
      password: "Student@123",
      role: "student",
      phone: "9876543213",
      roomNumber: "B-204",
      rollNumber: "CS2021004",
    });
    console.log("✅ Student 4 created:", student4.email);

    const student5 = await User.create({
      name: "Michael Brown",
      email: "michael@hostel.com",
      password: "Student@123",
      role: "student",
      phone: "9876543214",
      roomNumber: "B-205",
      rollNumber: "CS2021005",
    });
    console.log("✅ Student 5 created:", student5.email);

    const students = [student1, student2, student3, student4, student5];

    console.log("\n✅ All users created successfully!\n");

    console.log("📋 Login Credentials:");
    console.log("==================================================");
    console.log("Admin:");
    console.log("  Email: admin@hostel.com");
    console.log("  Password: Admin@123");
    console.log("");
    console.log("Manager:");
    console.log("  Email: manager@hostel.com");
    console.log("  Password: Manager@123");
    console.log("");
    console.log("Student:");
    console.log("  Email: student@hostel.com");
    console.log("  Password: Student@123");
    console.log("==================================================\n");

    console.log("✅ Database reseeded successfully!");
    console.log("🚀 You can now login with the credentials above");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error reseeding database:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

reseedDatabase();
