const mongoose = require("mongoose");
require("dotenv").config();

const testPaymentEndpoints = async () => {
  try {
    console.log("🧪 Testing Payment System...\n");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected\n");

    const Bill = require("./src/models/Bill.model");

    // Find a pending bill
    const pendingBill = await Bill.findOne({ status: "pending" }).populate(
      "student",
      "name email",
    );

    if (!pendingBill) {
      console.log("❌ No pending bills found");
      console.log(
        "💡 Generate bills first using: POST /api/v1/billing/generate",
      );
      process.exit(0);
    }

    console.log("📋 Found Pending Bill:");
    console.log("==================================================");
    console.log(`Student: ${pendingBill.student.name}`);
    console.log(`Email: ${pendingBill.student.email}`);
    console.log(`Month: ${pendingBill.month}/${pendingBill.year}`);
    console.log(`Amount: ₹${pendingBill.totalAmount}`);
    console.log(`Status: ${pendingBill.status}`);
    console.log(`Bill ID: ${pendingBill._id}`);
    console.log("==================================================\n");

    console.log("🔐 To test payment:");
    console.log("1. Login as student: student@hostel.com / Student@123");
    console.log("2. Go to: http://localhost:5173/student/bill");
    console.log("3. Click 'Pay Now' on any pending bill");
    console.log("4. Complete payment with Stripe\n");

    console.log("📡 Payment API Endpoints:");
    console.log("==================================================");
    console.log("POST /api/v1/payments/create-intent");
    console.log("Body: { billId: 'bill_id_here' }");
    console.log("");
    console.log("POST /api/v1/payments/confirm");
    console.log("Body: { billId: 'bill_id_here', paymentIntentId: 'pi_xxx' }");
    console.log("==================================================\n");

    console.log("💳 Stripe Test Cards:");
    console.log("==================================================");
    console.log("Success: 4242 4242 4242 4242");
    console.log("Decline: 4000 0000 0000 0002");
    console.log("Exp: Any future date");
    console.log("CVC: Any 3 digits");
    console.log("==================================================\n");

    // Check if Stripe is configured
    if (process.env.STRIPE_SECRET_KEY) {
      console.log("✅ Stripe Secret Key: Configured");
    } else {
      console.log("❌ Stripe Secret Key: NOT configured");
      console.log("💡 Add STRIPE_SECRET_KEY to server/.env");
    }

    if (process.env.STRIPE_PUBLISHABLE_KEY) {
      console.log("✅ Stripe Publishable Key: Configured");
    } else {
      console.log("❌ Stripe Publishable Key: NOT configured");
      console.log("💡 Add STRIPE_PUBLISHABLE_KEY to server/.env");
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

testPaymentEndpoints();
