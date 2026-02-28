const express = require("express");
const {
  generateBills,
  getMyBill,
  getAllBills,
  exportBillsCSV,
  downloadBillPDF,
} = require("../controllers/billing.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

router.post("/generate", protect, authorize("admin"), generateBills);
router.get("/export", protect, authorize("admin"), exportBillsCSV);
router.get("/me", protect, authorize("student"), getMyBill);
router.get("/:id/pdf", protect, downloadBillPDF);
router.get("/", protect, authorize("admin", "student"), getAllBills);

module.exports = router;
