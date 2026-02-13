const asyncHandler = require("express-async-handler");
const MealPlan = require("../models/MealPlan.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Create/Update meal plan
// @route   POST /api/v1/meal-plans
// @access  Private (Student)
const createMealPlan = asyncHandler(async (req, res) => {
  const { date, meals } = req.body;

  const planDate = new Date(date);
  planDate.setHours(0, 0, 0, 0);

  // Check if plan already exists
  let mealPlan = await MealPlan.findOne({
    student: req.user._id,
    date: planDate,
  });

  if (mealPlan) {
    // Update existing plan
    mealPlan.meals = { ...mealPlan.meals, ...meals };
    await mealPlan.save();
  } else {
    // Create new plan
    mealPlan = await MealPlan.create({
      student: req.user._id,
      date: planDate,
      meals,
    });
  }

  res
    .status(201)
    .json(new ApiResponse(201, { mealPlan }, "Meal plan saved successfully"));
});

// @desc    Get my meal plans
// @route   GET /api/v1/meal-plans/me?month=MM&year=YYYY
// @access  Private (Student)
const getMyMealPlans = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  let query = { student: req.user._id };

  if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    query.date = { $gte: startDate, $lte: endDate };
  }

  const mealPlans = await MealPlan.find(query).sort("-date");

  res.json(new ApiResponse(200, { mealPlans }));
});

// @desc    Get all meal plans (for a specific date)
// @route   GET /api/v1/meal-plans?date=YYYY-MM-DD
// @access  Private (Manager/Admin)
const getAllMealPlans = asyncHandler(async (req, res) => {
  const { date } = req.query;

  let query = {};

  if (date) {
    const planDate = new Date(date);
    planDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    query.date = { $gte: planDate, $lte: endDate };
  }

  const mealPlans = await MealPlan.find(query)
    .populate("student", "name email rollNumber")
    .sort("-date");

  res.json(new ApiResponse(200, { mealPlans }));
});

module.exports = {
  createMealPlan,
  getMyMealPlans,
  getAllMealPlans,
};
