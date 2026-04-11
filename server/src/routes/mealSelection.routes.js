const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  selectMealsForDay,
  selectMealsForDateRange,
  getMealCalendar,
  getMealSummary,
  getDailyMealCounts,
  getMealSelectionsForDateRange,
} = require("../controllers/mealSelection.controller");

// Student routes
router.post("/select", protect, authorize("student"), selectMealsForDay);
router.post("/bulk", protect, authorize("student"), selectMealsForDateRange);
router.get("/my-calendar", protect, authorize("student"), getMealCalendar);
router.get("/summary", protect, authorize("student"), getMealSummary);

// Admin routes
router.get("/daily-counts", protect, authorize("admin"), getDailyMealCounts);
router.get("/range", protect, authorize("admin"), getMealSelectionsForDateRange);

module.exports = router;
