const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const {
  generateBillsForMonth,
  generateBillForStudent,
  getBillDetails,
  getStudentBillSummary,
  getAllBills,
  getStudentBills,
  updateBillStatus,
  getBillingStatistics,
} = require("../controllers/billing.controller");

// Admin routes
router.post("/generate", protect, authorize("admin"), generateBillsForMonth);
router.post("/generate-single", protect, authorize("admin"), generateBillForStudent);
router.get("/", protect, authorize("admin"), getAllBills);
router.get("/stats/:year/:month", protect, authorize("admin"), getBillingStatistics);
router.put("/:billId", protect, authorize("admin"), updateBillStatus);

// Student routes
router.get("/student/:studentId", protect, getStudentBills);
router.get("/summary/:studentId", protect, getStudentBillSummary);

// General routes
router.get("/:billId", protect, getBillDetails);

module.exports = router;
