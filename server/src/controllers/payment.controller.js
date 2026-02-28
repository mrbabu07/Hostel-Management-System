const asyncHandler = require("express-async-handler");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Billing = require("../models/Bill.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Create payment intent
// @route   POST /api/v1/payments/create-intent
// @access  Private (Student)
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { billId, amount } = req.body;

  // Verify bill exists and belongs to user
  const bill = await Billing.findOne({
    _id: billId,
    student: req.user._id,
    status: "pending",
  });

  if (!bill) {
    throw new ApiError(404, "Bill not found or already paid");
  }

  // Create payment intent with Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(bill.totalAmount * 100), // Convert to paise/cents
    currency: "inr",
    metadata: {
      billId: bill._id.toString(),
      studentId: req.user._id.toString(),
      month: bill.month,
      year: bill.year,
    },
    description: `Mess Bill - ${new Date(2024, bill.month - 1).toLocaleString("default", { month: "long" })} ${bill.year}`,
  });

  res.status(200).json(
    new ApiResponse(200, {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }, "Payment intent created successfully")
  );
});

// @desc    Confirm payment
// @route   POST /api/v1/payments/confirm
// @access  Private (Student)
const confirmPayment = asyncHandler(async (req, res) => {
  const { billId, paymentIntentId } = req.body;

  // Verify payment intent with Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    throw new ApiError(400, "Payment not successful");
  }

  // Update bill status
  const bill = await Billing.findOneAndUpdate(
    {
      _id: billId,
      student: req.user._id,
      status: "pending",
    },
    {
      status: "paid",
      paidAt: new Date(),
      paymentMethod: "stripe",
      transactionId: paymentIntentId,
    },
    { new: true }
  );

  if (!bill) {
    throw new ApiError(404, "Bill not found or already paid");
  }

  res.status(200).json(
    new ApiResponse(200, { bill }, "Payment confirmed successfully")
  );
});

// @desc    Get payment history
// @route   GET /api/v1/payments/history
// @access  Private (Student)
const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Billing.find({
    student: req.user._id,
    status: "paid",
  })
    .sort({ paidAt: -1 })
    .select("month year totalAmount paidAt transactionId");

  res.status(200).json(
    new ApiResponse(200, { payments }, "Payment history retrieved successfully")
  );
});

// @desc    Webhook handler for Stripe events
// @route   POST /api/v1/payments/webhook
// @access  Public (Stripe)
const handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("Payment succeeded:", paymentIntent.id);
      // Additional logic if needed
      break;
    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      console.log("Payment failed:", failedPayment.id);
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  handleWebhook,
};
