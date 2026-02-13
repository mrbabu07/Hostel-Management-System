const express = require("express");
const {
  createNotice,
  getAllNotices,
  updateNotice,
  deleteNotice,
} = require("../controllers/notice.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", protect, authorize("admin"), createNotice);
router.get("/", protect, getAllNotices);
router.put("/:id", protect, authorize("admin"), updateNotice);
router.delete("/:id", protect, authorize("admin"), deleteNotice);

module.exports = router;
