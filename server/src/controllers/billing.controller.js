const asyncHandler = require("express-async-handler");
const billingService = require("../services/billing.service");
const Bill = require("../models/Bill.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Generate bill for a student for a month
// @route   POST /api/v1/billing/generate
// @access  Private (Admin)
const generateBill = asyncHandler(async (req, res) => {
  const { studentId, year, month } = req.body;

  if (!studentId || !year || !month) {
    throw new ApiError(400, "Student ID, year, and month are required");
  }

  const bill = await billingService.generateBill(studentId, year, month, req.user._id);

  res.json(new ApiResponse(200, { bill }, "Bill generated successfully"));
});

// @desc    Generate bills for all students for a month
// @route   POST /api/v1/billing/generate-all
// @access  Private (Admin)
const generateBillsForMonth = asyncHandler(async (req, res) => {
  const { year, month } = req.body;

  if (!year || !month) {
    throw new ApiError(400, "Year and month are required");
  }

  const bills = await billingService.generateBillsForMonth(year, month, req.user._id);

  res.json(new ApiResponse(200, { bills, count: bills.length }, "Bills generated successfully"));
});

// @desc    Get bill details
// @route   GET /api/v1/billing/:billId
// @access  Private
const getBillDetails = asyncHandler(async (req, res) => {
  const bill = await billingService.getBillDetails(req.params.billId);

  res.json(new ApiResponse(200, { bill }, "Bill details retrieved successfully"));
});

// @desc    Get student's monthly bill summary
// @route   GET /api/v1/billing/summary/:studentId
// @access  Private
const getStudentBillSummary = asyncHandler(async (req, res) => {
  const { year, month } = req.query;
  const { studentId } = req.params;

  if (!year || !month) {
    throw new ApiError(400, "Year and month are required");
  }

  const summary = await billingService.getStudentBillSummary(studentId, parseInt(year), parseInt(month));

  res.json(new ApiResponse(200, { summary }, "Bill summary retrieved successfully"));
});

// @desc    Get all bills for a student
// @route   GET /api/v1/billing/student/:studentId
// @access  Private
const getStudentBills = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const bills = await Bill.find({ student: studentId })
    .populate("student", "name email rollNumber")
    .sort({ year: -1, month: -1 });

  res.json(new ApiResponse(200, { bills }, "Student bills retrieved successfully"));
});

// @desc    Get all bills
// @route   GET /api/v1/billing
// @access  Private (Admin)
const getAllBills = asyncHandler(async (req, res) => {
  const { status, year, month } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (year) filter.year = parseInt(year);
  if (month) filter.month = parseInt(month);

  const bills = await Bill.find(filter)
    .populate("student", "name email rollNumber")
    .sort({ year: -1, month: -1 });

  res.json(new ApiResponse(200, { bills }, "All bills retrieved successfully"));
});

// @desc    Update bill status
// @route   PUT /api/v1/billing/:billId
// @access  Private (Admin)
const updateBillStatus = asyncHandler(async (req, res) => {
  const { status, paymentMethod, transactionId } = req.body;

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  const bill = await Bill.findById(req.params.billId);
  if (!bill) {
    throw new ApiError(404, "Bill not found");
  }

  bill.status = status;
  if (status === "paid") {
    bill.paidAt = new Date();
    if (paymentMethod) bill.paymentMethod = paymentMethod;
    if (transactionId) bill.transactionId = transactionId;
  }

  await bill.save();

  res.json(new ApiResponse(200, { bill }, "Bill status updated successfully"));
});

module.exports = {
  generateBill,
  generateBillsForMonth,
  getBillDetails,
  getStudentBillSummary,
  getStudentBills,
  getAllBills,
  updateBillStatus,
};
