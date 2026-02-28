const express = require("express");
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  handleWebhook,
} = require("../controllers/payment.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

// Webhook route (must be before other routes and without JSON parsing)
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

// Protected routes
router.use(protect);
router.use(authorize("student"));

router.post("/create-intent", createPaymentIntent);
router.post("/confirm", confirmPayment);
router.get("/history", getPaymentHistory);

module.exports = router;
