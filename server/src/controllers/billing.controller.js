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

  // Fixed monthly rate
  const MONTHLY_RATE = 6000; // 6000 TK per month

  // Get all students
  const students = await User.find({ role: "student", isActive: true });

  const bills = [];

  for (const student of students) {
    // Check if bill already exists
    const existingBill = await Bill.findOne({
      student: student._id,
      month: parseInt(month),
      year: parseInt(year),
    });

    if (existingBill) continue;

    // Fixed breakdown for display purposes
    const breakdown = {
      breakfast: {
        count: 30, // Assuming 30 days
        rate: 67, // Approximately 2000 TK for breakfast
        total: 2000,
      },
      lunch: {
        count: 30,
        rate: 67, // Approximately 2000 TK for lunch
        total: 2000,
      },
      dinner: {
        count: 30,
        rate: 67, // Approximately 2000 TK for dinner
        total: 2000,
      },
    };

    const bill = await Bill.create({
      student: student._id,
      month: parseInt(month),
      year: parseInt(year),
      breakdown,
      totalAmount: MONTHLY_RATE,
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
// @access  Private (Admin, Student)
const getAllBills = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  let query = {};

  // If student, only show their bills
  if (req.user.role === "student") {
    query.student = req.user._id;
  }

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

// @desc    Export bills as CSV
// @route   GET /api/v1/billing/export
// @access  Admin
const exportBillsCSV = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const CSVGenerator = require("../utils/csv");

  const query = {};
  if (month) query.month = parseInt(month);
  if (year) query.year = parseInt(year);

  const bills = await Bill.find(query)
    .populate("userId", "name rollNumber roomNumber")
    .sort({ createdAt: -1 })
    .lean();

  const csv = CSVGenerator.generateBillingCSV(bills);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=bills-${month}-${year}.csv`,
  );
  res.send(csv);
});

// @desc    Download bill as PDF
// @route   GET /api/v1/billing/:id/pdf
// @access  Student/Admin
const downloadBillPDF = asyncHandler(async (req, res) => {
  const PDFGenerator = require("../utils/pdf");
  const Settings = require("../models/Settings.model");

  const bill = await Bill.findById(req.params.id).populate(
    "userId",
    "name rollNumber roomNumber",
  );

  if (!bill) {
    throw new ApiError(404, "Bill not found");
  }

  // Check authorization
  if (
    req.user.role === "student" &&
    bill.userId._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "Not authorized to access this bill");
  }

  const settings = await Settings.getSettings();
  const pdfBuffer = await PDFGenerator.generateBillPDF(bill, settings);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=bill-${bill._id}.pdf`,
  );
  res.send(pdfBuffer);
});

module.exports = {
  generateBills,
  getMyBill,
  getAllBills,
  exportBillsCSV,
  downloadBillPDF,
};
