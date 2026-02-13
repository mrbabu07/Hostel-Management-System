const express = require("express");
const {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  updateComplaintStatus,
} = require("../controllers/complaint.controller");
const {
  validateComplaint,
  validateComplaintStatus,
} = require("../validations/complaint.validation");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("student"),
  validateComplaint,
  createComplaint,
);
router.get("/me", protect, authorize("student"), getMyComplaints);
router.get("/", protect, authorize("admin", "manager"), getAllComplaints);
router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  validateComplaintStatus,
  updateComplaintStatus,
);

module.exports = router;
