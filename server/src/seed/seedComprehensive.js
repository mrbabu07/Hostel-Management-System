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
    const mealTypes = ["breakfast", "lunch", "dinner"];
    const breakfastItems = [
      { name: "Paratha with Egg", description: "Crispy paratha with fried egg" },
      { name: "Puri with Potato Curry", description: "Fried puri with spiced potato" },
      { name: "Bread with Jam", description: "Toast with jam and butter" },
      { name: "Rice Porridge", description: "Soft rice porridge with vegetables" },
      { name: "Omelette with Toast", description: "Fluffy omelette with toasted bread" },
    ];
    const lunchItems = [
      { name: "Rice with Chicken Curry", description: "Basmati rice with tender chicken" },
      { name: "Rice with Fish Curry", description: "Rice with spiced fish curry" },
      { name: "Rice with Beef Curry", description: "Rice with rich beef curry" },
      { name: "Rice with Lentil Curry", description: "Rice with dal curry" },
      { name: "Biryani", description: "Fragrant biryani with meat" },
    ];
    const dinnerItems = [
      { name: "Roti with Vegetable Curry", description: "Soft roti with mixed vegetables" },
      { name: "Roti with Chicken Curry", description: "Roti with chicken curry" },
      { name: "Rice with Dal", description: "Rice with lentil soup" },
      { name: "Noodles", description: "Stir-fried noodles" },
      { name: "Fried Rice", description: "Fried rice with vegetables" },
    ];

    const adminUser = createdUsers.find((u) => u.role === "admin");

    for (let day = 0; day < 30; day++) {
      const date = new Date();
      date.setDate(date.getDate() + day);
      date.setHours(0, 0, 0, 0);

      mealTypes.forEach((mealType) => {
        let items;
        if (mealType === "breakfast") items = breakfastItems;
        else if (mealType === "lunch") items = lunchItems;
        else items = dinnerItems;

        menus.push({
          date: date,
          mealType: mealType,
          items: items.slice(0, 3),
          createdBy: adminUser._id,
        });
      });
    }

    const createdMenus = await Menu.insertMany(menus);
    console.log(`✅ Created ${createdMenus.length} menus\n`);

    // 3. Create Attendance (500 records)
    console.log("📍 Creating attendance records...");
    const attendanceRecords = [];
    const students = createdUsers.filter((u) => u.role === "student");
    const attendanceSet = new Set();

    // Create attendance for each student for each day and meal type
    for (let day = 0; day < 30; day++) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      date.setHours(0, 0, 0, 0);

      for (const student of students) {
        for (const mealType of mealTypes) {
          const key = `${student._id}-${date.toISOString()}-${mealType}`;
          if (!attendanceSet.has(key)) {
            attendanceSet.add(key);
            attendanceRecords.push({
              student: student._id,
              mealType: mealType,
              date: date,
              present: Math.random() > 0.2,
              approved: Math.random() > 0.3,
              markedBy: createdUsers.find((u) => u.role === "manager")?._id,
            });
          }
        }
      }
    }

    const createdAttendance = await Attendance.insertMany(attendanceRecords);
    console.log(`✅ Created ${createdAttendance.length} attendance records\n`);

    // 4. Create Bills (100 bills)
    console.log("💰 Creating bills...");
    const bills = [];
    const billSet = new Set();

    for (let i = 0; i < 100; i++) {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      const randomMonth = Math.floor(Math.random() * 12) + 1; // 1-12
      const year = 2024;
      
      const key = `${randomStudent._id}-${randomMonth}-${year}`;
      if (!billSet.has(key)) {
        billSet.add(key);
        
        const breakfastCount = Math.floor(Math.random() * 20) + 5;
        const lunchCount = Math.floor(Math.random() * 20) + 5;
        const dinnerCount = Math.floor(Math.random() * 20) + 5;

        const breakfastTotal = breakfastCount * 30;
        const lunchTotal = lunchCount * 50;
        const dinnerTotal = dinnerCount * 50;
        const totalAmount = breakfastTotal + lunchTotal + dinnerTotal;

        bills.push({
          student: randomStudent._id,
          month: randomMonth,
          year: year,
          breakdown: {
            breakfast: {
              count: breakfastCount,
              rate: 30,
              total: breakfastTotal,
            },
            lunch: {
              count: lunchCount,
              rate: 50,
              total: lunchTotal,
            },
            dinner: {
              count: dinnerCount,
              rate: 50,
              total: dinnerTotal,
            },
          },
          totalAmount: totalAmount,
          status: Math.random() > 0.3 ? "paid" : "pending",
          paidAt: Math.random() > 0.3 ? new Date() : null,
          paymentMethod: ["stripe", "cash", "other"][Math.floor(Math.random() * 3)],
          generatedBy: createdUsers.find((u) => u.role === "admin")?._id,
        });
      }
    }

    const createdBills = await Bill.insertMany(bills);
    console.log(`✅ Created ${createdBills.length} bills\n`);

    // 5. Create Complaints (80 complaints)
    console.log("📝 Creating complaints...");
    const complaints = [];
    const complaintCategories = ["food", "room", "maintenance", "other"];
    const complaintStatuses = ["pending", "in-progress", "resolved"];
    const complaintPriorities = ["low", "medium", "high"];

    for (let i = 0; i < 80; i++) {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      const isResolved = Math.random() > 0.6;
      
      complaints.push({
        student: randomStudent._id,
        category: complaintCategories[Math.floor(Math.random() * complaintCategories.length)],
        title: `Complaint ${i + 1}`,
        description: `This is a detailed complaint description for complaint ${i + 1}`,
        status: complaintStatuses[Math.floor(Math.random() * complaintStatuses.length)],
        priority: complaintPriorities[Math.floor(Math.random() * complaintPriorities.length)],
        resolvedBy: isResolved ? createdUsers.find((u) => u.role === "admin")?._id : null,
        resolvedAt: isResolved ? new Date() : null,
        adminNotes: `Admin response for complaint ${i + 1}`,
      });
    }

    const createdComplaints = await Complaint.insertMany(complaints);
    console.log(`✅ Created ${createdComplaints.length} complaints\n`);

    // 6. Create Notices (40 notices)
    console.log("📢 Creating notices...");
    const notices = [];
    const audiences = ["all", "students", "managers"];
    const noticeCategories = ["general", "urgent", "event", "maintenance"];

    for (let i = 0; i < 40; i++) {
      const isUrgent = i < 5; // First 5 notices are urgent and pinned
      notices.push({
        title: `${isUrgent ? "🚨 URGENT: " : ""}Notice ${i + 1}`,
        content: `This is the content of notice ${i + 1}. Important information for all users.`,
        category: isUrgent ? "urgent" : noticeCategories[Math.floor(Math.random() * noticeCategories.length)],
        targetAudience: audiences[Math.floor(Math.random() * audiences.length)],
        isPinned: isUrgent || Math.random() > 0.7,
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
    const inventoryItemNames = [
      "Rice",
      "Wheat Flour",
      "Lentils",
      "Chicken",
      "Fish",
      "Beef",
      "Tomatoes",
      "Onions",
      "Oil",
      "Salt",
      "Turmeric",
      "Milk",
      "Eggs",
      "Butter",
      "Bread",
    ];
    const inventoryCategories = ["vegetables", "grains", "dairy", "spices", "beverages", "other"];
    const inventoryUnits = ["kg", "g", "l", "ml", "pieces", "packets", "bags"];

    for (let i = 0; i < 50; i++) {
      const quantity = Math.floor(Math.random() * 1000) + 100;
      const minThreshold = Math.floor(Math.random() * 50) + 10;
      
      inventoryItems.push({
        itemName: inventoryItemNames[Math.floor(Math.random() * inventoryItemNames.length)] + ` ${i}`,
        quantity: quantity,
        unit: inventoryUnits[Math.floor(Math.random() * inventoryUnits.length)],
        category: inventoryCategories[Math.floor(Math.random() * inventoryCategories.length)],
        minThreshold: minThreshold,
        price: Math.floor(Math.random() * 500) + 50,
        supplier: `Supplier ${Math.floor(Math.random() * 10) + 1}`,
        lastRestocked: new Date(),
        expiryDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
      });
    }

    const createdInventory = await Inventory.insertMany(inventoryItems);
    console.log(`✅ Created ${createdInventory.length} inventory items\n`);

    // 9. Create Meal Plans (200 meal confirmations)
    console.log("🍴 Creating meal plans...");
    const mealPlans = [];
    const mealPlanSet = new Set();

    for (let i = 0; i < 200; i++) {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30));
      futureDate.setHours(0, 0, 0, 0);

      const key = `${randomStudent._id}-${futureDate.toISOString()}`;
      if (!mealPlanSet.has(key)) {
        mealPlanSet.add(key);
        
        mealPlans.push({
          student: randomStudent._id,
          date: futureDate,
          meals: {
            breakfast: Math.random() > 0.3,
            lunch: Math.random() > 0.3,
            dinner: Math.random() > 0.3,
          },
        });
      }
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
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
};

seedComprehensive();
