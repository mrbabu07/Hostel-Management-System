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

const seedWithBills = async () => {
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

    // ============================================
    // CREATE USERS
    // ============================================
    console.log("👥 Creating users...");

    const admin = await User.create({
      name: "Admin User",
      email: "admin@hostel.com",
      password: "Admin@123",
      role: "admin",
      phone: "1234567890",
      roomNumber: "A-101",
    });
    console.log("✅ Admin created");

    const manager = await User.create({
      name: "Mess Manager",
      email: "manager@hostel.com",
      password: "Manager@123",
      role: "manager",
      phone: "1234567891",
      roomNumber: "M-001",
    });
    console.log("✅ Manager created");

    const student1 = await User.create({
      name: "Md Jahedul Islam",
      email: "student@hostel.com",
      password: "Student@123",
      role: "student",
      phone: "9876543210",
      roomNumber: "B-201",
      rollNumber: "CS2021001",
    });

    const student2 = await User.create({
      name: "Alice Johnson",
      email: "alice@hostel.com",
      password: "Student@123",
      role: "student",
      phone: "9876543211",
      roomNumber: "B-202",
      rollNumber: "CS2021002",
    });

    const student3 = await User.create({
      name: "Bob Smith",
      email: "bob@hostel.com",
      password: "Student@123",
      role: "student",
      phone: "9876543212",
      roomNumber: "B-203",
      rollNumber: "CS2021003",
    });

    const student4 = await User.create({
      name: "Emma Wilson",
      email: "emma@hostel.com",
      password: "Student@123",
      role: "student",
      phone: "9876543213",
      roomNumber: "B-204",
      rollNumber: "CS2021004",
    });

    const student5 = await User.create({
      name: "Michael Brown",
      email: "michael@hostel.com",
      password: "Student@123",
      role: "student",
      phone: "9876543214",
      roomNumber: "B-205",
      rollNumber: "CS2021005",
    });

    const students = [student1, student2, student3, student4, student5];
    console.log(`✅ ${students.length} students created\n`);

    // ============================================
    // CREATE MENUS (7 days)
    // ============================================
    console.log("🍽️  Creating menus...");

    const menuItems = [
      {
        day: "Monday",
        breakfast: { items: ["Paratha", "Egg Curry", "Tea"], price: 30 },
        lunch: { items: ["Rice", "Dal", "Chicken Curry", "Salad"], price: 50 },
        dinner: { items: ["Roti", "Mixed Veg", "Dal", "Rice"], price: 50 },
      },
      {
        day: "Tuesday",
        breakfast: { items: ["Bread", "Butter", "Jam", "Milk"], price: 30 },
        lunch: { items: ["Biryani", "Raita", "Salad"], price: 50 },
        dinner: { items: ["Rice", "Fish Curry", "Dal"], price: 50 },
      },
      {
        day: "Wednesday",
        breakfast: { items: ["Puri", "Chana Masala", "Tea"], price: 30 },
        lunch: { items: ["Rice", "Mutton Curry", "Dal", "Salad"], price: 50 },
        dinner: { items: ["Roti", "Paneer Curry", "Rice"], price: 50 },
      },
      {
        day: "Thursday",
        breakfast: {
          items: ["Idli", "Sambar", "Chutney", "Coffee"],
          price: 30,
        },
        lunch: { items: ["Rice", "Chicken Curry", "Dal", "Papad"], price: 50 },
        dinner: { items: ["Roti", "Mixed Dal", "Rice", "Pickle"], price: 50 },
      },
      {
        day: "Friday",
        breakfast: { items: ["Paratha", "Aloo Sabzi", "Tea"], price: 30 },
        lunch: { items: ["Pulao", "Raita", "Chicken", "Salad"], price: 50 },
        dinner: { items: ["Rice", "Fish Fry", "Dal"], price: 50 },
      },
      {
        day: "Saturday",
        breakfast: { items: ["Dosa", "Sambar", "Chutney", "Tea"], price: 30 },
        lunch: { items: ["Rice", "Egg Curry", "Dal", "Salad"], price: 50 },
        dinner: { items: ["Roti", "Veg Curry", "Rice"], price: 50 },
      },
      {
        day: "Sunday",
        breakfast: { items: ["Special Paratha", "Paneer", "Tea"], price: 30 },
        lunch: { items: ["Special Biryani", "Raita", "Salad"], price: 50 },
        dinner: { items: ["Rice", "Chicken Curry", "Dal"], price: 50 },
      },
    ];

    for (const item of menuItems) {
      await Menu.create({
        day: item.day,
        mealType: "breakfast",
        items: item.breakfast.items,
        price: item.breakfast.price,
      });
      await Menu.create({
        day: item.day,
        mealType: "lunch",
        items: item.lunch.items,
        price: item.lunch.price,
      });
      await Menu.create({
        day: item.day,
        mealType: "dinner",
        items: item.dinner.items,
        price: item.dinner.price,
      });
    }
    console.log("✅ 21 menus created (7 days × 3 meals)\n");

    // ============================================
    // CREATE ATTENDANCE (Last 30 days)
    // ============================================
    console.log("📊 Creating attendance records...");

    const today = new Date();
    const attendanceRecords = [];

    // Create attendance for last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      for (const student of students) {
        // Random attendance (80% present)
        const breakfastPresent = Math.random() > 0.2;
        const lunchPresent = Math.random() > 0.2;
        const dinnerPresent = Math.random() > 0.2;

        if (breakfastPresent) {
          attendanceRecords.push({
            student: student._id,
            date: date,
            mealType: "breakfast",
            present: true,
            markedBy: manager._id,
          });
        }

        if (lunchPresent) {
          attendanceRecords.push({
            student: student._id,
            date: date,
            mealType: "lunch",
            present: true,
            markedBy: manager._id,
          });
        }

        if (dinnerPresent) {
          attendanceRecords.push({
            student: student._id,
            date: date,
            mealType: "dinner",
            present: true,
            markedBy: manager._id,
          });
        }
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log(`✅ ${attendanceRecords.length} attendance records created\n`);

    // ============================================
    // CREATE BILLS (Last 3 months)
    // ============================================
    console.log("💰 Creating bills...");

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear();

    const billsToCreate = [];

    // Create bills for last 3 months
    for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
      let month = currentMonth - monthOffset;
      let year = currentYear;

      // Handle year rollover
      if (month <= 0) {
        month += 12;
        year -= 1;
      }

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      for (const student of students) {
        // Get attendance for this student for this month
        const attendance = await Attendance.find({
          student: student._id,
          date: { $gte: startDate, $lte: endDate },
          present: true,
        });

        const breakfastCount = attendance.filter(
          (a) => a.mealType === "breakfast",
        ).length;
        const lunchCount = attendance.filter(
          (a) => a.mealType === "lunch",
        ).length;
        const dinnerCount = attendance.filter(
          (a) => a.mealType === "dinner",
        ).length;

        const breakdown = {
          breakfast: {
            count: breakfastCount,
            rate: 30,
            total: breakfastCount * 30,
          },
          lunch: {
            count: lunchCount,
            rate: 50,
            total: lunchCount * 50,
          },
          dinner: {
            count: dinnerCount,
            rate: 50,
            total: dinnerCount * 50,
          },
        };

        const totalAmount =
          breakdown.breakfast.total +
          breakdown.lunch.total +
          breakdown.dinner.total;

        // Current month: pending, previous months: some paid, some pending
        let status = "pending";
        let paidAt = null;
        let paymentMethod = null;
        let transactionId = null;

        if (monthOffset > 0) {
          // 70% of previous bills are paid
          if (Math.random() > 0.3) {
            status = "paid";
            paidAt = new Date(year, month, Math.floor(Math.random() * 10) + 1);
            paymentMethod = Math.random() > 0.5 ? "stripe" : "cash";
            transactionId =
              paymentMethod === "stripe"
                ? `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                : null;
          }
        }

        billsToCreate.push({
          student: student._id,
          month: month,
          year: year,
          breakdown: breakdown,
          totalAmount: totalAmount,
          status: status,
          paidAt: paidAt,
          paymentMethod: paymentMethod,
          transactionId: transactionId,
          generatedBy: admin._id,
        });
      }
    }

    await Bill.insertMany(billsToCreate);
    console.log(
      `✅ ${billsToCreate.length} bills created (3 months × ${students.length} students)\n`,
    );

    // ============================================
    // CREATE NOTICES
    // ============================================
    console.log("📢 Creating notices...");

    const notices = [
      {
        title: "Mess Timing Change",
        content:
          "Breakfast timing changed to 7:00 AM - 9:00 AM from next week.",
        priority: "high",
        createdBy: admin._id,
      },
      {
        title: "Holiday Notice",
        content: "Mess will be closed on 25th December for Christmas.",
        priority: "medium",
        createdBy: admin._id,
      },
      {
        title: "Menu Update",
        content: "New special items added to Sunday menu. Check the menu page!",
        priority: "low",
        createdBy: manager._id,
      },
      {
        title: "Payment Reminder",
        content:
          "Please clear your pending bills before month end to avoid late fees.",
        priority: "high",
        createdBy: admin._id,
      },
      {
        title: "Feedback Request",
        content:
          "Please provide feedback on the new menu items. Your opinion matters!",
        priority: "low",
        createdBy: manager._id,
      },
    ];

    await Notice.insertMany(notices);
    console.log(`✅ ${notices.length} notices created\n`);

    // ============================================
    // CREATE COMPLAINTS
    // ============================================
    console.log("📝 Creating complaints...");

    const complaints = [
      {
        student: student1._id,
        category: "food",
        subject: "Food Quality Issue",
        description: "The rice was undercooked in today's lunch.",
        status: "resolved",
      },
      {
        student: student2._id,
        category: "maintenance",
        subject: "Dining Hall Cleanliness",
        description: "Tables were not cleaned properly after breakfast.",
        status: "in-progress",
      },
      {
        student: student3._id,
        category: "other",
        subject: "Late Meal Service",
        description: "Dinner was served 30 minutes late yesterday.",
        status: "pending",
      },
      {
        student: student4._id,
        category: "food",
        subject: "Menu Variety",
        description: "Please add more vegetarian options in the menu.",
        status: "pending",
      },
      {
        student: student5._id,
        category: "room",
        subject: "Dining Hall AC",
        description: "Air conditioning not working properly in dining hall.",
        status: "in-progress",
      },
    ];

    await Complaint.insertMany(complaints);
    console.log(`✅ ${complaints.length} complaints created\n`);

    // ============================================
    // CREATE FEEDBACK
    // ============================================
    console.log("⭐ Creating feedback...");

    const feedbacks = [
      {
        student: student1._id,
        mealType: "lunch",
        rating: 5,
        comment: "Excellent biryani today! Really enjoyed it.",
        date: new Date(),
      },
      {
        student: student2._id,
        mealType: "breakfast",
        rating: 4,
        comment: "Good breakfast, but tea could be better.",
        date: new Date(),
      },
      {
        student: student3._id,
        mealType: "dinner",
        rating: 3,
        comment: "Average dinner. Need more variety.",
        date: new Date(),
      },
      {
        student: student4._id,
        mealType: "lunch",
        rating: 5,
        comment: "Great food quality and taste!",
        date: new Date(),
      },
      {
        student: student5._id,
        mealType: "breakfast",
        rating: 4,
        comment: "Nice breakfast options.",
        date: new Date(),
      },
    ];

    await Feedback.insertMany(feedbacks);
    console.log(`✅ ${feedbacks.length} feedback entries created\n`);

    // ============================================
    // CREATE SETTINGS
    // ============================================
    console.log("⚙️  Creating settings...");

    await Settings.create({
      messName: "Smart Hostel Mess",
      messIncharge: manager._id,
      breakfastTime: { start: "07:00", end: "09:00" },
      lunchTime: { start: "12:00", end: "14:00" },
      dinnerTime: { start: "19:00", end: "21:00" },
      mealRates: {
        breakfast: 30,
        lunch: 50,
        dinner: 50,
      },
      holidays: [
        { date: new Date("2026-12-25"), reason: "Christmas" },
        { date: new Date("2026-01-01"), reason: "New Year" },
        { date: new Date("2026-08-15"), reason: "Independence Day" },
      ],
    });
    console.log("✅ Settings created\n");

    // ============================================
    // SUMMARY
    // ============================================
    console.log("═══════════════════════════════════════════════════");
    console.log("✅ DATABASE SEEDED SUCCESSFULLY!");
    console.log("═══════════════════════════════════════════════════\n");

    console.log("📊 Summary:");
    console.log(
      `  👥 Users: ${students.length + 2} (1 admin, 1 manager, ${students.length} students)`,
    );
    console.log(`  🍽️  Menus: 21 (7 days × 3 meals)`);
    console.log(`  📊 Attendance: ${attendanceRecords.length} records`);
    console.log(`  💰 Bills: ${billsToCreate.length} (3 months)`);
    console.log(`  📢 Notices: ${notices.length}`);
    console.log(`  📝 Complaints: ${complaints.length}`);
    console.log(`  ⭐ Feedback: ${feedbacks.length}`);
    console.log(`  ⚙️  Settings: 1\n`);

    console.log("📋 Login Credentials:");
    console.log("═══════════════════════════════════════════════════");
    console.log("Admin:");
    console.log("  Email: admin@hostel.com");
    console.log("  Password: Admin@123");
    console.log("  Dashboard: /admin/dashboard");
    console.log("");
    console.log("Manager:");
    console.log("  Email: manager@hostel.com");
    console.log("  Password: Manager@123");
    console.log("  Dashboard: /manager/dashboard");
    console.log("");
    console.log("Student:");
    console.log("  Email: student@hostel.com");
    console.log("  Password: Student@123");
    console.log("  Dashboard: /student/dashboard");
    console.log("═══════════════════════════════════════════════════\n");

    console.log("💰 Billing Summary:");
    console.log("═══════════════════════════════════════════════════");
    const totalBills = billsToCreate.length;
    const paidBills = billsToCreate.filter((b) => b.status === "paid").length;
    const pendingBills = billsToCreate.filter(
      (b) => b.status === "pending",
    ).length;
    const totalRevenue = billsToCreate
      .filter((b) => b.status === "paid")
      .reduce((sum, b) => sum + b.totalAmount, 0);
    const pendingRevenue = billsToCreate
      .filter((b) => b.status === "pending")
      .reduce((sum, b) => sum + b.totalAmount, 0);

    console.log(`  Total Bills: ${totalBills}`);
    console.log(`  Paid Bills: ${paidBills}`);
    console.log(`  Pending Bills: ${pendingBills}`);
    console.log(`  Total Revenue: ₹${totalRevenue}`);
    console.log(`  Pending Revenue: ₹${pendingRevenue}`);
    console.log("═══════════════════════════════════════════════════\n");

    console.log("🎯 What You Can Do Now:");
    console.log("═══════════════════════════════════════════════════");
    console.log("✅ Login as student and view your bills");
    console.log("✅ Pay pending bills (demo mode)");
    console.log("✅ Login as admin and see all bills");
    console.log("✅ Login as manager and view billing reports");
    console.log("✅ Generate new bills for current month");
    console.log("✅ Export bills as CSV/PDF");
    console.log("═══════════════════════════════════════════════════\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedWithBills();
