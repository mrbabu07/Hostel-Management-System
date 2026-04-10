require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import models
const User = require("../models/User.model");
const Menu = require("../models/Menu.model");
const Attendance = require("../models/Attendance.model");
const Bill = require("../models/Bill.model");
const Complaint = require("../models/Complaint.model");
const Notice = require("../models/Notice.model");
const Feedback = require("../models/Feedback.model");
const Inventory = require("../models/Inventory.model");
const MealPlan = require("../models/MealPlan.model");

const seedComprehensive = async () => {
  try {
    console.log("🌱 Starting comprehensive database seeding...\n");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Menu.deleteMany({}),
      Attendance.deleteMany({}),
      Bill.deleteMany({}),
      Complaint.deleteMany({}),
      Notice.deleteMany({}),
      Feedback.deleteMany({}),
      Inventory.deleteMany({}),
      MealPlan.deleteMany({}),
    ]);
    console.log("✅ Data cleared\n");

    // 1. Create Users (50 students, 5 managers, 2 admins)
    console.log("👥 Creating users...");
    const hashedPassword = await bcrypt.hash("Password@123", 10);

    const users = [];

    // Admins
    users.push(
      {
        name: "Admin User",
        email: "admin@hostel.com",
        password: hashedPassword,
        role: "admin",
        isActive: true,
      },
      {
        name: "Super Admin",
        email: "superadmin@hostel.com",
        password: hashedPassword,
        role: "admin",
        isActive: true,
      }
    );

    // Managers
    for (let i = 1; i <= 5; i++) {
      users.push({
        name: `Manager ${i}`,
        email: `manager${i}@hostel.com`,
        password: hashedPassword,
        role: "manager",
        isActive: true,
      });
    }

    // Students (50)
    for (let i = 1; i <= 50; i++) {
      users.push({
        name: `Student ${i}`,
        email: `student${i}@hostel.com`,
        password: hashedPassword,
        role: "student",
        rollNumber: `2024${String(i).padStart(3, "0")}`,
        roomNumber: `Room ${100 + i}`,
        phone: `01700${String(i).padStart(6, "0")}`,
        isActive: true,
      });
    }

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users\n`);

    // 2. Create Menus (30 days of menus)
    console.log("🍽️  Creating menus...");
    const menus = [];
    const mealTypes = ["Breakfast", "Lunch", "Dinner"];
    const breakfastItems = [
      "Paratha with Egg",
      "Puri with Potato Curry",
      "Bread with Jam",
      "Rice Porridge",
      "Omelette with Toast",
    ];
    const lunchItems = [
      "Rice with Chicken Curry",
      "Rice with Fish Curry",
      "Rice with Beef Curry",
      "Rice with Lentil Curry",
      "Biryani",
    ];
    const dinnerItems = [
      "Roti with Vegetable Curry",
      "Roti with Chicken Curry",
      "Rice with Dal",
      "Noodles",
      "Fried Rice",
    ];

    for (let day = 0; day < 30; day++) {
      const date = new Date();
      date.setDate(date.getDate() + day);

      mealTypes.forEach((mealType) => {
        let items;
        if (mealType === "Breakfast") items = breakfastItems;
        else if (mealType === "Lunch") items = lunchItems;
        else items = dinnerItems;

        menus.push({
          date: date,
          mealType: mealType,
          items: items.slice(0, 3),
          description: `${mealType} menu for ${date.toDateString()}`,
          cutoffTime: new Date(date.getTime() - 2 * 60 * 60 * 1000),
        });
      });
    }

    const createdMenus = await Menu.insertMany(menus);
    console.log(`✅ Created ${createdMenus.length} menus\n`);

    // 3. Create Attendance (500 records)
    console.log("📍 Creating attendance records...");
    const attendanceRecords = [];
    const students = createdUsers.filter((u) => u.role === "student");

    for (let i = 0; i < 500; i++) {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      const randomMealType = mealTypes[Math.floor(Math.random() * mealTypes.length)];
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));

      attendanceRecords.push({
        student: randomStudent._id,
        mealType: randomMealType,
        date: randomDate,
        status: Math.random() > 0.2 ? "Present" : "Absent",
        markedBy: createdUsers.find((u) => u.role === "manager")?._id,
      });
    }

    const createdAttendance = await Attendance.insertMany(attendanceRecords);
    console.log(`✅ Created ${createdAttendance.length} attendance records\n`);

    // 4. Create Bills (100 bills)
    console.log("💰 Creating bills...");
    const bills = [];
    const months = ["January", "February", "March", "April", "May", "June"];

    for (let i = 0; i < 100; i++) {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      const randomMonth = months[Math.floor(Math.random() * months.length)];
      const mealCount = Math.floor(Math.random() * 60) + 20;

      bills.push({
        student: randomStudent._id,
        month: randomMonth,
        year: 2024,
        totalMeals: mealCount,
        mealCost: 100,
        totalAmount: mealCount * 100,
        charges: Math.floor(Math.random() * 500),
        discount: Math.floor(Math.random() * 200),
        tax: Math.floor((mealCount * 100 * 15) / 100),
        status: Math.random() > 0.3 ? "PAID" : "DUE",
        paidDate: Math.random() > 0.3 ? new Date() : null,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    }

    const createdBills = await Bill.insertMany(bills);
    console.log(`✅ Created ${createdBills.length} bills\n`);

    // 5. Create Complaints (80 complaints)
    console.log("📝 Creating complaints...");
    const complaints = [];
    const categories = ["Food", "Room", "Maintenance", "Other"];
    const statuses = ["Pending", "In Progress", "Resolved", "Rejected"];
    const priorities = ["Low", "Medium", "High"];

    for (let i = 0; i < 80; i++) {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      complaints.push({
        student: randomStudent._id,
        category: categories[Math.floor(Math.random() * categories.length)],
        title: `Complaint ${i + 1}`,
        description: `This is a detailed complaint description for complaint ${i + 1}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        adminNote: `Admin response for complaint ${i + 1}`,
        resolvedDate: Math.random() > 0.5 ? new Date() : null,
      });
    }

    const createdComplaints = await Complaint.insertMany(complaints);
    console.log(`✅ Created ${createdComplaints.length} complaints\n`);

    // 6. Create Notices (40 notices)
    console.log("📢 Creating notices...");
    const notices = [];
    const audiences = ["All", "Student", "Manager"];

    for (let i = 0; i < 40; i++) {
      notices.push({
        title: `Notice ${i + 1}`,
        content: `This is the content of notice ${i + 1}. Important information for all users.`,
        targetAudience: audiences[Math.floor(Math.random() * audiences.length)],
        isPinned: Math.random() > 0.7,
        createdBy: createdUsers.find((u) => u.role === "admin")?._id,
      });
    }

    const createdNotices = await Notice.insertMany(notices);
    console.log(`✅ Created ${createdNotices.length} notices\n`);

    // 7. Create Feedback (150 feedback records)
    console.log("⭐ Creating feedback...");
    const feedbacks = [];

    for (let i = 0; i < 150; i++) {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      feedbacks.push({
        student: randomStudent._id,
        mealType: mealTypes[Math.floor(Math.random() * mealTypes.length)],
        rating: Math.floor(Math.random() * 5) + 1,
        comment: `Feedback comment ${i + 1}. This meal was ${["excellent", "good", "average", "poor"][Math.floor(Math.random() * 4)]}.`,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }

    const createdFeedback = await Feedback.insertMany(feedbacks);
    console.log(`✅ Created ${createdFeedback.length} feedback records\n`);

    // 8. Create Inventory (50 items)
    console.log("📦 Creating inventory...");
    const inventoryItems = [];
    const items = [
      "Rice",
      "Wheat Flour",
      "Lentils",
      "Chicken",
      "Fish",
      "Beef",
      "Vegetables",
      "Oil",
      "Salt",
      "Spices",
      "Milk",
      "Eggs",
      "Butter",
      "Cheese",
      "Bread",
    ];

    for (let i = 0; i < 50; i++) {
      inventoryItems.push({
        itemName: items[Math.floor(Math.random() * items.length)] + ` ${i}`,
        quantity: Math.floor(Math.random() * 1000) + 100,
        unit: ["kg", "liter", "piece", "box"][Math.floor(Math.random() * 4)],
        category: ["Grains", "Vegetables", "Meat", "Dairy", "Spices"][
          Math.floor(Math.random() * 5)
        ],
        lastUpdated: new Date(),
      });
    }

    const createdInventory = await Inventory.insertMany(inventoryItems);
    console.log(`✅ Created ${createdInventory.length} inventory items\n`);

    // 9. Create Meal Plans (200 meal confirmations)
    console.log("🍴 Creating meal plans...");
    const mealPlans = [];

    for (let i = 0; i < 200; i++) {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30));

      mealPlans.push({
        student: randomStudent._id,
        date: futureDate,
        mealType: mealTypes[Math.floor(Math.random() * mealTypes.length)],
        confirmed: Math.random() > 0.3,
      });
    }

    const createdMealPlans = await MealPlan.insertMany(mealPlans);
    console.log(`✅ Created ${createdMealPlans.length} meal plans\n`);

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("✅ COMPREHENSIVE DATABASE SEEDING COMPLETED!");
    console.log("=".repeat(50));
    console.log("\n📊 Summary:");
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   🍽️  Menus: ${createdMenus.length}`);
    console.log(`   📍 Attendance: ${createdAttendance.length}`);
    console.log(`   💰 Bills: ${createdBills.length}`);
    console.log(`   📝 Complaints: ${createdComplaints.length}`);
    console.log(`   📢 Notices: ${createdNotices.length}`);
    console.log(`   ⭐ Feedback: ${createdFeedback.length}`);
    console.log(`   📦 Inventory: ${createdInventory.length}`);
    console.log(`   🍴 Meal Plans: ${createdMealPlans.length}`);
    console.log("\n🔐 Default Credentials:");
    console.log("   Admin: admin@hostel.com / Password@123");
    console.log("   Manager: manager1@hostel.com / Password@123");
    console.log("   Student: student1@hostel.com / Password@123");
    console.log("\n" + "=".repeat(50) + "\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedComprehensive();
