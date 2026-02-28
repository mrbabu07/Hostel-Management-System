const express = require("express");
const {
  getSettings,
  updateSettings,
  addHoliday,
  removeHoliday,
} = require("../controllers/settings.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize("admin"));

router.route("/").get(getSettings).patch(updateSettings);

router.post("/holidays", addHoliday);
router.delete("/holidays/:id", removeHoliday);

module.exports = router;
