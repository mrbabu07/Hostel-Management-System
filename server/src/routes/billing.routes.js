const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const {
  generateBillsForMonth,
  deleteAllAndGenerateBills,
  resetAndGenerateBills,
  regenerateBillsForMonth,
  fixAllBills,
  generateBillForStudent,
  getBillDetails,
  getStudentBillSummary,
  getAllBills,
  getMyBills,
  getStudentBills,
  updateBillStatus,
  getBillingStatistics,
} = require("../controllers/billing.controller");

// Student routes (must come before :billId to avoid conflicts)
router.get("/me", protect, getMyBills);
router.get("/student/:studentId", protect, getStudentBills);
router.get("/summary/:studentId", protect, getStudentBillSummary);

// Admin routes
router.post("/generate", protect, authorize("admin"), generateBillsForMonth);
router.post("/delete-all-and-generate", protect, authorize("admin"), deleteAllAndGenerateBills);
router.post("/reset-and-generate", protect, authorize("admin"), resetAndGenerateBills);
router.post("/regenerate", protect, authorize("admin"), regenerateBillsForMonth);
router.post("/fix-all", protect, authorize("admin"), fixAllBills);
router.post("/generate-single", protect, authorize("admin"), generateBillForStudent);
router.get("/", protect, authorize("admin"), getAllBills);
router.get("/stats/:year/:month", protect, authorize("admin"), getBillingStatistics);
router.put("/:billId", protect, authorize("admin"), updateBillStatus);

// General routes
router.get("/:billId", protect, getBillDetails);

module.exports = router;
