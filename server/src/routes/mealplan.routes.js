const express = require("express");
const {
  createMealPlan,
  getMyMealPlans,
  getAllMealPlans,
} = require("../controllers/mealplan.controller");
const { validateMealPlan } = require("../validations/mealplan.validation");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("student"),
  validateMealPlan,
  createMealPlan,
);
router.get("/me", protect, authorize("student"), getMyMealPlans);
router.get("/", protect, authorize("manager", "admin"), getAllMealPlans);

module.exports = router;
