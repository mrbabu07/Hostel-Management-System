const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const {
  generateBill,
  generateBillsForMonth,
  getBillDetails,
  getStudentBillSummary,
  getStudentBills,
  getAllBills,
  updateBillStatus,
} = require("../controllers/billing.controller");

// Admin routes
router.post("/generate", protect, authorize("admin"), generateBill);
router.post("/generate-all", protect, authorize("admin"), generateBillsForMonth);
router.get("/", protect, authorize("admin"), getAllBills);
router.put("/:billId", protect, authorize("admin"), updateBillStatus);

// Student routes
router.get("/student/:studentId", protect, getStudentBills);
router.get("/summary/:studentId", protect, getStudentBillSummary);

// General routes
router.get("/:billId", protect, getBillDetails);

module.exports = router;
