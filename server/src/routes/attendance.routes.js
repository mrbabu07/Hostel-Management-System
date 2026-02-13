const express = require("express");
const {
  markAttendance,
  getAttendanceReport,
  getMyAttendance,
} = require("../controllers/attendance.controller");
const { validateAttendance } = require("../validations/attendance.validation");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

router.post(
  "/mark",
  protect,
  authorize("manager", "admin"),
  validateAttendance,
  markAttendance,
);
router.get(
  "/report",
  protect,
  authorize("manager", "admin"),
  getAttendanceReport,
);
router.get("/me", protect, authorize("student"), getMyAttendance);

module.exports = router;
