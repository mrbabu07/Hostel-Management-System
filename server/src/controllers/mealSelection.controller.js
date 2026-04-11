const asyncHandler = require("express-async-handler");
const mealSelectionService = require("../services/mealSelection.service");
const settingsService = require("../services/settings.service");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Select meals for a single day
// @route   POST /api/v1/meals/select
// @access  Private (Student)
const selectMealsForDay = asyncHandler(async (req, res) => {
  const { date, meals } = req.body;
  const studentId = req.user._id;

  // Validate input
  if (!date || !meals) {
    throw new ApiError(400, "Date and meals are required");
  }

  if (typeof meals.breakfast !== "boolean" || typeof meals.lunch !== "boolean" || typeof meals.dinner !== "boolean") {
    throw new ApiError(400, "Each meal must be a boolean value");
  }

  // Get settings for cutoff time
  const settings = await settingsService.getSettings();
  const cutoffHour = settings?.cutoffTime?.hour || 22; // Default 10 PM
  const cutoffMinute = settings?.cutoffTime?.minute || 0;

  // Check if student can modify meals
  const mealDate = new Date(date);
  mealDate.setHours(0, 0, 0, 0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // Students can only modify next day's meals before cutoff
  if (mealDate >= tomorrow) {
    const canModify = await mealSelectionService.canModifyMeals(cutoffHour, cutoffMinute);
    if (!canModify) {
      throw new ApiError(400, `Cannot modify meals after ${cutoffHour}:${cutoffMinute.toString().padStart(2, "0")}`);
    }
  }

  const mealSelection = await mealSelectionService.selectMealsForDay(studentId, date, meals);

  res.json(new ApiResponse(200, { mealSelection }, "Meals selected successfully"));
});

// @desc    Bulk select meals for a date range
// @route   POST /api/v1/meals/bulk
// @access  Private (Student)
const selectMealsForDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate, meals } = req.body;
  const studentId = req.user._id;

  // Validate input
  if (!startDate || !endDate || !meals) {
    throw new ApiError(400, "Start date, end date, and meals are required");
  }

  if (typeof meals.breakfast !== "boolean" || typeof meals.lunch !== "boolean" || typeof meals.dinner !== "boolean") {
    throw new ApiError(400, "Each meal must be a boolean value");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    throw new ApiError(400, "Start date must be before end date");
  }

  // Get settings for cutoff time
  const settings = await settingsService.getSettings();
  const cutoffHour = settings?.cutoffTime?.hour || 22;
  const cutoffMinute = settings?.cutoffTime?.minute || 0;

  // Check if student can modify meals
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  if (start >= tomorrow) {
    const canModify = await mealSelectionService.canModifyMeals(cutoffHour, cutoffMinute);
    if (!canModify) {
      throw new ApiError(400, `Cannot modify meals after ${cutoffHour}:${cutoffMinute.toString().padStart(2, "0")}`);
    }
  }

  const result = await mealSelectionService.selectMealsForDateRange(studentId, startDate, endDate, meals);

  res.json(new ApiResponse(200, { result }, "Meals selected for date range successfully"));
});

// @desc    Get meal calendar for a student (month view)
// @route   GET /api/v1/meals/my-calendar
// @access  Private (Student)
const getMealCalendar = asyncHandler(async (req, res) => {
  const { year, month } = req.query;
  const studentId = req.user._id;

  if (!year || !month) {
    throw new ApiError(400, "Year and month are required");
  }

  const mealSelections = await mealSelectionService.getMealCalendar(studentId, parseInt(year), parseInt(month));

  res.json(new ApiResponse(200, { mealSelections }, "Meal calendar retrieved successfully"));
});

// @desc    Get meal summary for a student (monthly count)
// @route   GET /api/v1/meals/summary
// @access  Private (Student)
const getMealSummary = asyncHandler(async (req, res) => {
  const { year, month } = req.query;
  const studentId = req.user._id;

  if (!year || !month) {
    throw new ApiError(400, "Year and month are required");
  }

  const summary = await mealSelectionService.getMealSummary(studentId, parseInt(year), parseInt(month));

  res.json(new ApiResponse(200, { summary }, "Meal summary retrieved successfully"));
});

// @desc    Get daily meal counts (admin view)
// @route   GET /api/v1/meals/daily-counts
// @access  Private (Admin)
const getDailyMealCounts = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date) {
    throw new ApiError(400, "Date is required");
  }

  const counts = await mealSelectionService.getDailyMealCounts(date);

  res.json(new ApiResponse(200, { counts }, "Daily meal counts retrieved successfully"));
});

// @desc    Get meal selections for a date range (admin view)
// @route   GET /api/v1/meals/range
// @access  Private (Admin)
const getMealSelectionsForDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    throw new ApiError(400, "Start date and end date are required");
  }

  const selections = await mealSelectionService.getMealSelectionsForDateRange(startDate, endDate);

  res.json(new ApiResponse(200, { selections }, "Meal selections retrieved successfully"));
});

module.exports = {
  selectMealsForDay,
  selectMealsForDateRange,
  getMealCalendar,
  getMealSummary,
  getDailyMealCounts,
  getMealSelectionsForDateRange,
};
