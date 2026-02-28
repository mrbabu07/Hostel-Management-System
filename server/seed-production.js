const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("❌ Error: MONGO_URI or MONGODB_URI not found in .env file");
  console.log(
    "Please make sure you have a .env file in the server directory with MONGODB_URI defined",
  );
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

const seedDatabase = async () => {
  try {
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Menu.deleteMany({});
    await Notice.deleteMany({});
    await Complaint.deleteMany({});
    await Bill.deleteMany({});
    await MealPlan.deleteMany({});
    await Attendance.deleteMany({});
    await Feedback.deleteMany({});
    await Settings.deleteMany({});

    console.log("👥 Creating users...");

    // Create Admin
    const admin = await User.create({
      name: "Admin User",
      email: "admin@hostel.com",
      password: "Admin@123",
      role: "admin",
      phone: "1234567890",
      roomNumber: "A-101",
    });

    // Create Manager
    const manager = await User.create({
      name: "Mess Manager",
      email: "manager@hostel.com",
      password: "Manager@123",
      role: "manager",
      phone: "1234567891",
      roomNumber: "M-001",
    });

    // Create Students
    const students = await User.insertMany([
      {
        name: "John Doe",
        email: "student@hostel.com",
        password: "Student@123",
        role: "student",
        phone: "9876543210",
        roomNumber: "B-201",
      },
      {
        name: "Alice Johnson",
        email: "alice@hostel.com",
        password: "Password@123",
        role: "student",
        phone: "9876543211",
        roomNumber: "B-202",
      },
      {
        name: "Bob Smith",
        email: "bob@hostel.com",
        password: "Password@123",
        role: "student",
        phone: "9876543212",
        roomNumber: "B-203",
      },
      {
        name: "Emma Wilson",
        email: "emma@hostel.com",
        password: "Password@123",
        role: "student",
        phone: "9876543213",
        roomNumber: "B-204",
      },
      {
        name: "Michael Brown",
        email: "michael@hostel.com",
        password: "Password@123",
        role: "student",
        phone: "9876543214",
        roomNumber: "B-205",
      },
    ]);

    console.log("🍽️  Creating menus...");
    const today = new Date();
    const menus = [];

    const breakfastItems = [
      [
        { name: "Idli", description: "Steamed rice cakes" },
        { name: "Sambar", description: "Lentil vegetable stew" },
        { name: "Chutney", description: "Coconut chutney" },
      ],
      [
        { name: "Poha", description: "Flattened rice" },
        { name: "Tea", description: "Hot tea" },
      ],
      [
        { name: "Upma", description: "Semolina dish" },
        { name: "Coffee", description: "Hot coffee" },
      ],
      [
        { name: "Paratha", description: "Flatbread" },
        { name: "Curd", description: "Yogurt" },
      ],
      [
        { name: "Dosa", description: "Rice crepe" },
        { name: "Sambar", description: "Lentil stew" },
        { name: "Chutney", description: "Coconut chutney" },
      ],
      [
        { name: "Bread", description: "Sliced bread" },
        { name: "Butter & Jam", description: "Spreads" },
        { name: "Tea", description: "Hot tea" },
      ],
      [
        { name: "Aloo Paratha", description: "Potato stuffed flatbread" },
        { name: "Curd", description: "Yogurt" },
      ],
    ];

    const lunchItems = [
      [
        { name: "Rice", description: "Steamed rice" },
        { name: "Dal", description: "Lentils" },
        { name: "Roti", description: "Flatbread" },
        { name: "Sabzi", description: "Mixed vegetables" },
        { name: "Salad", description: "Fresh salad" },
      ],
      [
        { name: "Biryani", description: "Spiced rice" },
        { name: "Raita", description: "Yogurt dip" },
        { name: "Salad", description: "Fresh salad" },
      ],
      [
        { name: "Rice", description: "Steamed rice" },
        { name: "Rajma", description: "Kidney beans curry" },
        { name: "Roti", description: "Flatbread" },
        { name: "Aloo Gobi", description: "Potato cauliflower" },
      ],
      [
        { name: "Rice", description: "Steamed rice" },
        { name: "Chole", description: "Chickpea curry" },
        { name: "Roti", description: "Flatbread" },
        { name: "Mix Veg", description: "Mixed vegetables" },
      ],
      [
        { name: "Rice", description: "Steamed rice" },
        { name: "Dal Makhani", description: "Creamy lentils" },
        { name: "Roti", description: "Flatbread" },
        { name: "Paneer", description: "Cottage cheese curry" },
      ],
      [
        { name: "Pulao", description: "Spiced rice" },
        { name: "Kadhi", description: "Yogurt curry" },
        { name: "Roti", description: "Flatbread" },
        { name: "Salad", description: "Fresh salad" },
      ],
      [
        { name: "Rice", description: "Steamed rice" },
        { name: "Sambar", description: "Lentil stew" },
        { name: "Roti", description: "Flatbread" },
        { name: "Bhindi", description: "Okra curry" },
      ],
    ];

    const dinnerItems = [
      [
        { name: "Roti", description: "Flatbread" },
        { name: "Dal", description: "Lentils" },
        { name: "Rice", description: "Steamed rice" },
        { name: "Mix Veg", description: "Mixed vegetables" },
      ],
      [
        { name: "Roti", description: "Flatbread" },
        {
          name: "Paneer Butter Masala",
          description: "Cottage cheese in tomato gravy",
        },
        { name: "Rice", description: "Steamed rice" },
      ],
      [
        { name: "Roti", description: "Flatbread" },
        { name: "Chana Masala", description: "Chickpea curry" },
        { name: "Rice", description: "Steamed rice" },
      ],
      [
        { name: "Roti", description: "Flatbread" },
        { name: "Aloo Matar", description: "Potato peas curry" },
        { name: "Rice", description: "Steamed rice" },
        { name: "Dal", description: "Lentils" },
      ],
      [
        { name: "Roti", description: "Flatbread" },
        { name: "Palak Paneer", description: "Spinach cottage cheese" },
        { name: "Rice", description: "Steamed rice" },
      ],
      [
        { name: "Roti", description: "Flatbread" },
        { name: "Kadhai Veg", description: "Mixed vegetables" },
        { name: "Rice", description: "Steamed rice" },
        { name: "Dal", description: "Lentils" },
      ],
      [
        { name: "Roti", description: "Flatbread" },
        { name: "Malai Kofta", description: "Cottage cheese dumplings" },
        { name: "Rice", description: "Steamed rice" },
      ],
    ];

    // Create menus for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0);

      // Breakfast
      menus.push({
        date: date,
        mealType: "breakfast",
        items: breakfastItems[i % 7],
        createdBy: manager._id,
      });

      // Lunch
      menus.push({
        date: date,
        mealType: "lunch",
        items: lunchItems[i % 7],
        createdBy: manager._id,
      });

      // Dinner
      menus.push({
        date: date,
        mealType: "dinner",
        items: dinnerItems[i % 7],
        createdBy: manager._id,
      });
    }

    const createdMenus = await Menu.insertMany(menus);

    console.log("📢 Creating notices...");
    await Notice.insertMany([
      {
        title: "Hostel Mess Timing Update",
        content:
          "Please note that from next week, breakfast timing will be from 7:30 AM to 9:30 AM. Lunch: 12:30 PM - 2:30 PM. Dinner: 7:30 PM - 9:30 PM.",
        priority: "high",
        createdBy: admin._id,
      },
      {
        title: "Special Menu This Sunday",
        content:
          "This Sunday we are serving special biryani for lunch and special dessert. Don't miss it!",
        priority: "medium",
        createdBy: manager._id,
      },
      {
        title: "Mess Closed on National Holiday",
        content:
          "The mess will remain closed on 26th January (Republic Day). Please make alternative arrangements.",
        priority: "high",
        createdBy: admin._id,
      },
      {
        title: "Feedback Survey",
        content:
          "Please share your feedback about the mess food quality and service. Your opinion matters!",
        priority: "low",
        createdBy: manager._id,
      },
      {
        title: "New Menu Items Added",
        content:
          "We have added new items to our menu based on your suggestions. Check out the updated menu!",
        priority: "medium",
        createdBy: manager._id,
      },
    ]);

    console.log("📝 Creating complaints...");
    await Complaint.insertMany([
      {
        student: students[0]._id,
        title: "Food Quality Issue",
        description:
          "The dal served yesterday was not properly cooked and tasted bland. Please improve the quality.",
        category: "food",
        status: "pending",
        priority: "high",
      },
      {
        student: students[1]._id,
        title: "Late Dinner Service",
        description:
          "Dinner was served 30 minutes late yesterday. This causes inconvenience for students.",
        category: "food",
        status: "in-progress",
        priority: "medium",
      },
      {
        student: students[2]._id,
        title: "Room Cleanliness Concern",
        description:
          "The dining hall tables were not properly cleaned during lunch time.",
        category: "room",
        status: "resolved",
        priority: "medium",
        adminNotes:
          "We have addressed this issue and increased cleaning frequency.",
      },
      {
        student: students[3]._id,
        title: "Insufficient Food Quantity",
        description:
          "The quantity of rice served is not sufficient. Many students are left hungry.",
        category: "food",
        status: "pending",
        priority: "high",
      },
      {
        student: students[4]._id,
        title: "Maintenance Required",
        description:
          "The water cooler in the dining hall is not working properly. Please fix it.",
        category: "maintenance",
        status: "in-progress",
        priority: "medium",
      },
    ]);

    console.log("💰 Creating billing records...");
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear();

    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    for (const student of students) {
      // Last month bill (paid)
      await Bill.create({
        student: student._id,
        month: lastMonth,
        year: lastMonthYear,
        breakdown: {
          breakfast: { count: 25, rate: 30, total: 750 },
          lunch: { count: 28, rate: 50, total: 1400 },
          dinner: { count: 27, rate: 45, total: 1215 },
        },
        totalAmount: 3365,
        status: "paid",
        generatedBy: admin._id,
      });

      // Current month bill (pending)
      await Bill.create({
        student: student._id,
        month: currentMonth,
        year: currentYear,
        breakdown: {
          breakfast: { count: 20, rate: 30, total: 600 },
          lunch: { count: 22, rate: 50, total: 1100 },
          dinner: { count: 21, rate: 45, total: 945 },
        },
        totalAmount: 2645,
        status: "pending",
        generatedBy: admin._id,
      });
    }

    console.log("🍽️  Creating meal plans...");
    // Create meal plans for today for all students
    for (const student of students) {
      await MealPlan.create({
        student: student._id,
        date: today,
        breakfast: true,
        lunch: true,
        dinner: true,
      });
    }

    console.log("✅ Creating attendance records...");
    // Create attendance for the last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);

      for (const student of students) {
        // Breakfast attendance
        await Attendance.create({
          student: student._id,
          date: date,
          mealType: "breakfast",
          present: Math.random() > 0.2, // 80% attendance
          markedBy: manager._id,
        });

        // Lunch attendance
        await Attendance.create({
          student: student._id,
          date: date,
          mealType: "lunch",
          present: Math.random() > 0.15, // 85% attendance
          markedBy: manager._id,
        });

        // Dinner attendance
        await Attendance.create({
          student: student._id,
          date: date,
          mealType: "dinner",
          present: Math.random() > 0.25, // 75% attendance
          markedBy: manager._id,
        });
      }
    }

    console.log("⭐ Creating feedback...");
    const feedbackDate = new Date(today);
    feedbackDate.setDate(today.getDate() - 1); // Yesterday's feedback
    feedbackDate.setHours(0, 0, 0, 0);

    await Feedback.insertMany([
      {
        student: students[0]._id,
        date: feedbackDate,
        mealType: "breakfast",
        rating: 4,
        comment:
          "Good food quality overall. The breakfast options are excellent!",
      },
      {
        student: students[1]._id,
        date: feedbackDate,
        mealType: "lunch",
        rating: 5,
        comment: "Very satisfied with the lunch. Staff is very cooperative.",
      },
      {
        student: students[2]._id,
        date: feedbackDate,
        mealType: "dinner",
        rating: 3,
        comment:
          "Food is okay but could be better. Need more variety in the menu.",
      },
      {
        student: students[3]._id,
        date: feedbackDate,
        mealType: "breakfast",
        rating: 4,
        comment: "Breakfast is good. Clean and well-maintained dining area.",
      },
      {
        student: students[4]._id,
        date: feedbackDate,
        mealType: "lunch",
        rating: 5,
        comment:
          "Excellent mess management. The new menu items are really good!",
      },
    ]);

    console.log("⚙️  Creating settings...");
    await Settings.create({
      messName: "University Hostel Mess",
      messAddress: "123 Campus Road, University Area",
      contactPhone: "1234567890",
      contactEmail: "mess@university.edu",
      breakfastPrice: 30,
      lunchPrice: 50,
      dinnerPrice: 45,
      cutoffTime: "20:00", // 8 PM
      cutoffDaysBefore: 1,
      holidays: [
        {
          date: new Date("2024-01-26"),
          reason: "Republic Day",
        },
        {
          date: new Date("2024-08-15"),
          reason: "Independence Day",
        },
        {
          date: new Date("2024-10-02"),
          reason: "Gandhi Jayanti",
        },
      ],
    });

    console.log("\n✅ Database seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(
      `   - Users: ${await User.countDocuments()} (1 Admin, 1 Manager, 5 Students)`,
    );
    console.log(
      `   - Menus: ${await Menu.countDocuments()} (7 days × 3 meals)`,
    );
    console.log(`   - Notices: ${await Notice.countDocuments()}`);
    console.log(`   - Complaints: ${await Complaint.countDocuments()}`);
    console.log(`   - Bills: ${await Bill.countDocuments()}`);
    console.log(`   - Meal Plans: ${await MealPlan.countDocuments()}`);
    console.log(`   - Attendance: ${await Attendance.countDocuments()}`);
    console.log(`   - Feedback: ${await Feedback.countDocuments()}`);
    console.log(`   - Settings: ${await Settings.countDocuments()}`);

    console.log("\n🔐 Login Credentials:");
    console.log("   Admin:");
    console.log("     Email: admin@hostel.com");
    console.log("     Password: Admin@123");
    console.log("\n   Manager:");
    console.log("     Email: manager@hostel.com");
    console.log("     Password: Manager@123");
    console.log("\n   Student:");
    console.log("     Email: student@hostel.com");
    console.log("     Password: Student@123");
    console.log("\n   Other Students:");
    console.log(
      "     alice@hostel.com, bob@hostel.com, emma@hostel.com, michael@hostel.com",
    );
    console.log("     Password: Password@123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
