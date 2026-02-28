const asyncHandler = require("express-async-handler");
const Menu = require("../models/Menu.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Get today's menu
// @route   GET /api/v1/menus/today
// @access  Private
const getTodayMenu = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const menus = await Menu.find({
    date: { $gte: today, $lt: tomorrow },
  })
    .populate("createdBy", "name email")
    .sort("mealType");

  // Format the response
  const formattedMenu = {
    date: today,
    breakfast: menus.find((m) => m.mealType === "breakfast"),
    lunch: menus.find((m) => m.mealType === "lunch"),
    dinner: menus.find((m) => m.mealType === "dinner"),
  };

  res.json(new ApiResponse(200, { menu: formattedMenu }));
});

// @desc    Get menus by date
// @route   GET /api/v1/menus?date=YYYY-MM-DD
// @access  Private
const getMenus = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date) {
    throw new ApiError(400, "Date parameter is required");
  }

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const menus = await Menu.find({
    date: { $gte: startDate, $lte: endDate },
  })
    .populate("createdBy", "name email")
    .sort("mealType");

  res.json(new ApiResponse(200, { menus }));
});

// @desc    Create menu
// @route   POST /api/v1/menus
// @access  Private (Manager)
const createMenu = asyncHandler(async (req, res) => {
  const { date, mealType, items } = req.body;

  const menuDate = new Date(date);
  menuDate.setHours(0, 0, 0, 0);

  const menu = await Menu.create({
    date: menuDate,
    mealType,
    items,
    createdBy: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, { menu }, "Menu created successfully"));
});

// @desc    Update menu
// @route   PUT /api/v1/menus/:id
// @access  Private (Manager)
const updateMenu = asyncHandler(async (req, res) => {
  const { items } = req.body;

  const menu = await Menu.findById(req.params.id);
  if (!menu) {
    throw new ApiError(404, "Menu not found");
  }

  menu.items = items;
  await menu.save();

  res.json(new ApiResponse(200, { menu }, "Menu updated successfully"));
});

// @desc    Delete menu
// @route   DELETE /api/v1/menus/:id
// @access  Private (Manager)
const deleteMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.findById(req.params.id);
  if (!menu) {
    throw new ApiError(404, "Menu not found");
  }

  await menu.deleteOne();
  res.json(new ApiResponse(200, {}, "Menu deleted successfully"));
});

module.exports = {
  getTodayMenu,
  getMenus,
  createMenu,
  updateMenu,
  deleteMenu,
};
