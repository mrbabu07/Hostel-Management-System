const express = require("express");
const {
  markAttendance,
  getAttendanceReport,
  getMyAttendance,
  exportAttendanceCSV,
  markSelfAttendance,
  approveAttendance,
  getPendingAttendance,
} = require("../controllers/attendance.controller");
const { validateAttendance } = require("../validations/attendance.validation");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

// Manager/Admin routes
router.post(
  "/mark",
  protect,
  authorize("manager", "admin"),
  validateAttendance,
  markAttendance,
);
router.get(
  "/export",
  protect,
  authorize("manager", "admin"),
  exportAttendanceCSV,
);
router.get(
  "/report",
  protect,
  authorize("manager", "admin"),
  getAttendanceReport,
);
router.get(
  "/pending",
  protect,
  authorize("manager", "admin"),
  getPendingAttendance,
);
router.patch(
  "/:id/approve",
  protect,
  authorize("manager", "admin"),
  approveAttendance,
);

// Student routes
router.get("/me", protect, authorize("student"), getMyAttendance);
router.post("/self-mark", protect, authorize("student"), markSelfAttendance);

module.exports = router;
