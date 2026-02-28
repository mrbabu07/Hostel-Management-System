const asyncHandler = require("express-async-handler");
const SettingsService = require("../services/settings.service");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Get system settings
// @route   GET /api/v1/settings
// @access  Admin
const getSettings = asyncHandler(async (req, res) => {
  const settings = await SettingsService.getSettings();
  res.json(new ApiResponse(200, settings, "Settings retrieved successfully"));
});

// @desc    Update system settings
// @route   PATCH /api/v1/settings
// @access  Admin
const updateSettings = asyncHandler(async (req, res) => {
  const settings = await SettingsService.updateSettings(
    req.body,
    req.user._id,
    req.user.role,
    req.ip,
    req.get("user-agent"),
  );

  res.json(new ApiResponse(200, settings, "Settings updated successfully"));
});

// @desc    Add holiday
// @route   POST /api/v1/settings/holidays
// @access  Admin
const addHoliday = asyncHandler(async (req, res) => {
  const { date, reason } = req.body;

  const settings = await SettingsService.addHoliday(
    date,
    reason,
    req.user._id,
    req.user.role,
  );

  res.json(new ApiResponse(200, settings, "Holiday added successfully"));
});

// @desc    Remove holiday
// @route   DELETE /api/v1/settings/holidays/:id
// @access  Admin
const removeHoliday = asyncHandler(async (req, res) => {
  const settings = await SettingsService.removeHoliday(
    req.params.id,
    req.user._id,
    req.user.role,
  );

  res.json(new ApiResponse(200, settings, "Holiday removed successfully"));
});

module.exports = {
  getSettings,
  updateSettings,
  addHoliday,
  removeHoliday,
};
