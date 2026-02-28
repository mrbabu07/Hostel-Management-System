const asyncHandler = require("express-async-handler");
const AnalyticsService = require("../services/analytics.service");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Get overview analytics
// @route   GET /api/v1/analytics/overview
// @access  Admin/Manager
const getOverview = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  const currentDate = new Date();
  const targetMonth = month || currentDate.getMonth() + 1;
  const targetYear = year || currentDate.getFullYear();

  const overview = await AnalyticsService.getOverview(targetMonth, targetYear);

  res.json(
    new ApiResponse(200, overview, "Overview analytics retrieved successfully"),
  );
});

// @desc    Get attendance trends
// @route   GET /api/v1/analytics/attendance-trends
// @access  Admin/Manager
const getAttendanceTrends = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  const currentDate = new Date();
  const targetMonth = month || currentDate.getMonth() + 1;
  const targetYear = year || currentDate.getFullYear();

  const trends = await AnalyticsService.getAttendanceTrends(
    targetMonth,
    targetYear,
  );

  res.json(
    new ApiResponse(200, trends, "Attendance trends retrieved successfully"),
  );
});

// @desc    Get revenue trends
// @route   GET /api/v1/analytics/revenue-trends
// @access  Admin
const getRevenueTrends = asyncHandler(async (req, res) => {
  const { year } = req.query;
  const targetYear = year || new Date().getFullYear();

  const trends = await AnalyticsService.getRevenueTrends(targetYear);

  res.json(
    new ApiResponse(200, trends, "Revenue trends retrieved successfully"),
  );
});

// @desc    Get feedback analytics
// @route   GET /api/v1/analytics/feedback
// @access  Admin/Manager
const getFeedbackAnalytics = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  const currentDate = new Date();
  const targetMonth = month || currentDate.getMonth() + 1;
  const targetYear = year || currentDate.getFullYear();

  const analytics = await AnalyticsService.getFeedbackAnalytics(
    targetMonth,
    targetYear,
  );

  res.json(
    new ApiResponse(
      200,
      analytics,
      "Feedback analytics retrieved successfully",
    ),
  );
});

// @desc    Get complaint analytics
// @route   GET /api/v1/analytics/complaints
// @access  Admin
const getComplaintAnalytics = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  const currentDate = new Date();
  const targetMonth = month || currentDate.getMonth() + 1;
  const targetYear = year || currentDate.getFullYear();

  const analytics = await AnalyticsService.getComplaintAnalytics(
    targetMonth,
    targetYear,
  );

  res.json(
    new ApiResponse(
      200,
      analytics,
      "Complaint analytics retrieved successfully",
    ),
  );
});

// @desc    Get meal popularity
// @route   GET /api/v1/analytics/meal-popularity
// @access  Admin/Manager
const getMealPopularity = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  const currentDate = new Date();
  const targetMonth = month || currentDate.getMonth() + 1;
  const targetYear = year || currentDate.getFullYear();

  const popularity = await AnalyticsService.getMealPopularity(
    targetMonth,
    targetYear,
  );

  res.json(
    new ApiResponse(200, popularity, "Meal popularity retrieved successfully"),
  );
});

module.exports = {
  getOverview,
  getAttendanceTrends,
  getRevenueTrends,
  getFeedbackAnalytics,
  getComplaintAnalytics,
  getMealPopularity,
};
