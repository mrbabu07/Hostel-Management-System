const express = require("express");
const {
  generateBills,
  getMyBill,
  getAllBills,
} = require("../controllers/billing.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

router.post("/generate", protect, authorize("admin"), generateBills);
router.get("/me", protect, authorize("student"), getMyBill);
router.get("/", protect, authorize("admin"), getAllBills);

module.exports = router;
