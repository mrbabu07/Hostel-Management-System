const express = require("express");
const {
  getOverview,
  getAttendanceTrends,
  getRevenueTrends,
  getFeedbackAnalytics,
  getComplaintAnalytics,
  getMealPopularity,
} = require("../controllers/analytics.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin and Manager can access most analytics
router.get("/overview", authorize("admin", "manager"), getOverview);

router.get(
  "/attendance-trends",
  authorize("admin", "manager"),
  getAttendanceTrends,
);

router.get("/feedback", authorize("admin", "manager"), getFeedbackAnalytics);

router.get(
  "/meal-popularity",
  authorize("admin", "manager"),
  getMealPopularity,
);

// Admin only
router.get("/revenue-trends", authorize("admin"), getRevenueTrends);
router.get("/complaints", authorize("admin"), getComplaintAnalytics);

module.exports = router;
