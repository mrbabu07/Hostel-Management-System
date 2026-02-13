const express = require("express");
const {
  submitFeedback,
  getFeedbackSummary,
  getMyFeedback,
} = require("../controllers/feedback.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", protect, authorize("student"), submitFeedback);
router.get(
  "/summary",
  protect,
  authorize("manager", "admin"),
  getFeedbackSummary,
);
router.get("/me", protect, authorize("student"), getMyFeedback);

module.exports = router;
