const asyncHandler = require("express-async-handler");
const Bill = require("../models/Bill.model");
const Attendance = require("../models/Attendance.model");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Generate bills for a month
// @route   POST /api/v1/billing/generate?month=MM&year=YYYY
// @access  Private (Admin)
const generateBills = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    throw new ApiError(400, "Month and year are required");
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  // Get all students
  const students = await User.find({ role: "student", isActive: true });

  const bills = [];
  const rates = {
    breakfast: 30,
    lunch: 50,
    dinner: 50,
  };

  for (const student of students) {
    // Check if bill already exists
    const existingBill = await Bill.findOne({
      student: student._id,
      month: parseInt(month),
      year: parseInt(year),
    });

    if (existingBill) continue;

    // Get attendance for this student for the month
    const attendance = await Attendance.find({
      student: student._id,
      date: { $gte: startDate, $lte: endDate },
      present: true,
    });

    const breakdown = {
      breakfast: {
        count: attendance.filter((a) => a.mealType === "breakfast").length,
        rate: rates.breakfast,
        total: 0,
      },
      lunch: {
        count: attendance.filter((a) => a.mealType === "lunch").length,
        rate: rates.lunch,
        total: 0,
      },
      dinner: {
        count: attendance.filter((a) => a.mealType === "dinner").length,
        rate: rates.dinner,
        total: 0,
      },
    };

    breakdown.breakfast.total =
      breakdown.breakfast.count * breakdown.breakfast.rate;
    breakdown.lunch.total = breakdown.lunch.count * breakdown.lunch.rate;
    breakdown.dinner.total = breakdown.dinner.count * breakdown.dinner.rate;

    const totalAmount =
      breakdown.breakfast.total +
      breakdown.lunch.total +
      breakdown.dinner.total;

    const bill = await Bill.create({
      student: student._id,
      month: parseInt(month),
      year: parseInt(year),
      breakdown,
      totalAmount,
      generatedBy: req.user._id,
    });

    bills.push(bill);
  }

  res.status(201).json(
    new ApiResponse(
      201,
      {
        count: bills.length,
        bills,
      },
      `Generated ${bills.length} bills successfully`,
    ),
  );
});

// @desc    Get my bill
// @route   GET /api/v1/billing/me?month=MM&year=YYYY
// @access  Private (Student)
const getMyBill = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    throw new ApiError(400, "Month and year are required");
  }

  const bill = await Bill.findOne({
    student: req.user._id,
    month: parseInt(month),
    year: parseInt(year),
  }).populate("generatedBy", "name email");

  if (!bill) {
    throw new ApiError(404, "Bill not found for this month");
  }

  res.json(new ApiResponse(200, { bill }));
});

// @desc    Get all bills
// @route   GET /api/v1/billing?month=MM&year=YYYY
// @access  Private (Admin)
const getAllBills = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  let query = {};

  if (month && year) {
    query.month = parseInt(month);
    query.year = parseInt(year);
  }

  const bills = await Bill.find(query)
    .populate("student", "name email rollNumber roomNumber")
    .populate("generatedBy", "name email")
    .sort("-year -month");

  res.json(new ApiResponse(200, { bills }));
});

module.exports = {
  generateBills,
  getMyBill,
  getAllBills,
};
