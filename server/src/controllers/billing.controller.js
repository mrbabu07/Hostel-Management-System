const asyncHandler = require("express-async-handler");
const billingService = require("../services/billing.service");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Generate bills for all students for a month
// @route   POST /api/v1/billing/generate
// @access  Private (Admin)
const generateBillsForMonth = asyncHandler(async (req, res) => {
  const { year, month } = req.body;

  if (!year || !month) {
    throw new ApiError(400, "Year and month are required");
  }

  // Validate month
  if (month < 1 || month > 12) {
    throw new ApiError(400, "Month must be between 1 and 12");
  }

  console.log(`Admin ${req.user._id} generating bills for ${month}/${year}`);

  const result = await billingService.generateBillsForMonth(year, month, req.user._id);

  res.json(
    new ApiResponse(
      200,
      result,
      `Bills generated successfully for ${result.count} students`
    )
  );
});

// @desc    Seed bills for all students for a month
// @route   POST /api/v1/billing/seed
// @access  Private (Admin)
const seedBillsForMonth = asyncHandler(async (req, res) => {
  const { year, month } = req.body;

  if (!year || !month) {
    throw new ApiError(400, "Year and month are required");
  }

  // Validate month
  if (month < 1 || month > 12) {
    throw new ApiError(400, "Month must be between 1 and 12");
  }

  console.log(`Admin ${req.user._id} seeding bills for ${month}/${year}`);

  const result = await billingService.generateBillsForMonth(year, month, req.user._id);

  res.json(
    new ApiResponse(
      200,
      result,
      `Bills seeded successfully for ${result.count} students`
    )
  );
});

// @desc    Delete ALL bills and generate new ones for a month
// @route   POST /api/v1/billing/delete-all-and-generate
// @access  Private (Admin)
const deleteAllAndGenerateBills = asyncHandler(async (req, res) => {
  const { year, month } = req.body;

  if (!year || !month) {
    throw new ApiError(400, "Year and month are required");
  }

  // Validate month
  if (month < 1 || month > 12) {
    throw new ApiError(400, "Month must be between 1 and 12");
  }

  console.log(`Admin ${req.user._id} deleting ALL bills and generating new ones for ${month}/${year}`);

  // Delete ALL bills from database
  const deleteResult = await billingService.deleteAllBills();
  console.log(`Deleted ${deleteResult.deletedCount} bills from database`);

  // Generate new bills
  const result = await billingService.generateBillsForMonth(year, month, req.user._id);

  res.json(
    new ApiResponse(
      200,
      {
        deletedCount: deleteResult.deletedCount,
        generatedCount: result.count,
        ...result,
      },
      `Deleted ${deleteResult.deletedCount} bills and generated ${result.count} new bills`
    )
  );
});

// @desc    Fix all bills by recalculating totalMeals
// @route   POST /api/v1/billing/fix-all
// @access  Private (Admin)
const fixAllBills = asyncHandler(async (req, res) => {
  console.log(`Admin ${req.user._id} fixing all bills`);

  const result = await billingService.fixAllBills();

  res.json(
    new ApiResponse(
      200,
      result,
      `Fixed ${result.fixedCount} bills successfully`
    )
  );
});

// @desc    Delete all bills and regenerate for a month
// @route   POST /api/v1/billing/reset-and-generate
// @access  Private (Admin)
const resetAndGenerateBills = asyncHandler(async (req, res) => {
  const { year, month } = req.body;

  if (!year || !month) {
    throw new ApiError(400, "Year and month are required");
  }

  // Validate month
  if (month < 1 || month > 12) {
    throw new ApiError(400, "Month must be between 1 and 12");
  }

  console.log(`Admin ${req.user._id} resetting and generating bills for ${month}/${year}`);

  // Delete all bills for this month
  await billingService.deleteBillsForMonth(year, month);

  // Generate new bills
  const result = await billingService.generateBillsForMonth(year, month, req.user._id);

  res.json(
    new ApiResponse(
      200,
      result,
      `Bills reset and generated successfully for ${result.count} students`
    )
  );
});

// @desc    Regenerate bills for a month (when settings change)
// @route   POST /api/v1/billing/regenerate
// @access  Private (Admin)
const regenerateBillsForMonth = asyncHandler(async (req, res) => {
  const { year, month } = req.body;

  if (!year || !month) {
    throw new ApiError(400, "Year and month are required");
  }

  // Validate month
  if (month < 1 || month > 12) {
    throw new ApiError(400, "Month must be between 1 and 12");
  }

  console.log(`Admin ${req.user._id} regenerating bills for ${month}/${year}`);

  const result = await billingService.regenerateBillsForMonth(year, month, req.user._id);

  res.json(
    new ApiResponse(
      200,
      result,
      `Bills regenerated successfully for ${result.count} students`
    )
  );
});

// @desc    Generate bill for a single student
// @route   POST /api/v1/billing/generate-single
// @access  Private (Admin)
const generateBillForStudent = asyncHandler(async (req, res) => {
  const { studentId, year, month } = req.body;

  if (!studentId || !year || !month) {
    throw new ApiError(400, "Student ID, year, and month are required");
  }

  const bill = await billingService.generateBillForStudent(studentId, year, month, req.user._id);

  res.json(new ApiResponse(200, { bill }, "Bill generated successfully"));
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

  const summary = await billingService.getStudentBillSummary(
    studentId,
    parseInt(year),
    parseInt(month)
  );

  res.json(new ApiResponse(200, { summary }, "Bill summary retrieved successfully"));
});

// @desc    Get all bills
// @route   GET /api/v1/billing
// @access  Private (Admin)
const getAllBills = asyncHandler(async (req, res) => {
  const { status, year, month } = req.query;

  const filters = {};
  if (status) filters.status = status;
  if (year) filters.year = parseInt(year);
  if (month) filters.month = parseInt(month);

  const bills = await billingService.getAllBills(filters);

  res.json(new ApiResponse(200, { bills, count: bills.length }, "All bills retrieved successfully"));
});

// @desc    Get current user's bills (for students)
// @route   GET /api/v1/billing/me
// @access  Private (Student)
const getMyBills = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const bills = await billingService.getStudentBills(studentId);

  res.json(new ApiResponse(200, { bills, count: bills.length }, "Your bills retrieved successfully"));
});

// @desc    Get student's all bills
// @route   GET /api/v1/billing/student/:studentId
// @access  Private
const getStudentBills = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const bills = await billingService.getStudentBills(studentId);

  res.json(new ApiResponse(200, { bills, count: bills.length }, "Student bills retrieved successfully"));
});

// @desc    Update bill status
// @route   PUT /api/v1/billing/:billId
// @access  Private (Admin)
const updateBillStatus = asyncHandler(async (req, res) => {
  const { status, paymentMethod, transactionId } = req.body;

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  const bill = await billingService.updateBillStatus(
    req.params.billId,
    status,
    paymentMethod,
    transactionId
  );

  res.json(new ApiResponse(200, { bill }, "Bill status updated successfully"));
});

// @desc    Get billing statistics for a month
// @route   GET /api/v1/billing/stats/:year/:month
// @access  Private (Admin)
const getBillingStatistics = asyncHandler(async (req, res) => {
  const { year, month } = req.params;

  if (!year || !month) {
    throw new ApiError(400, "Year and month are required");
  }

  const stats = await billingService.getBillingStatistics(parseInt(year), parseInt(month));

  res.json(new ApiResponse(200, { stats }, "Billing statistics retrieved successfully"));
});

// @desc    Get bills with missing data
// @route   GET /api/v1/billing/check/missing-data
// @access  Private (Admin)
const getBillsWithMissingData = asyncHandler(async (req, res) => {
  const bills = await billingService.getBillsWithMissingData();

  res.json(
    new ApiResponse(
      200,
      { bills, count: bills.length },
      `Found ${bills.length} bills with missing data`
    )
  );
});

module.exports = {
  generateBillsForMonth,
  seedBillsForMonth,
  deleteAllAndGenerateBills,
  resetAndGenerateBills,
  regenerateBillsForMonth,
  fixAllBills,
  generateBillForStudent,
  getBillDetails,
  getStudentBillSummary,
  getAllBills,
  getMyBills,
  getStudentBills,
  updateBillStatus,
  getBillingStatistics,
  getBillsWithMissingData,
};
