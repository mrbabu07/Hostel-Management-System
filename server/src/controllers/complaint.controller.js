const asyncHandler = require("express-async-handler");
const Complaint = require("../models/Complaint.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Create complaint
// @route   POST /api/v1/complaints
// @access  Private (Student)
const createComplaint = asyncHandler(async (req, res) => {
  const { category, title, description, priority } = req.body;

  const complaint = await Complaint.create({
    student: req.user._id,
    category,
    title,
    description,
    priority: priority || "medium",
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, { complaint }, "Complaint submitted successfully"),
    );
});

// @desc    Get all complaints
// @route   GET /api/v1/complaints?status=pending&category=food
// @access  Private (Admin/Manager)
const getAllComplaints = asyncHandler(async (req, res) => {
  const { status, category } = req.query;

  let query = {};

  if (status) query.status = status;
  if (category) query.category = category;

  const complaints = await Complaint.find(query)
    .populate("student", "name email rollNumber roomNumber")
    .populate("resolvedBy", "name email")
    .sort("-createdAt");

  res.json(new ApiResponse(200, { complaints }));
});

// @desc    Get my complaints
// @route   GET /api/v1/complaints/me
// @access  Private (Student)
const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ student: req.user._id })
    .populate("resolvedBy", "name email")
    .sort("-createdAt");

  res.json(new ApiResponse(200, { complaints }));
});

// @desc    Update complaint status
// @route   PATCH /api/v1/complaints/:id/status
// @access  Private (Admin)
const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }

  complaint.status = status;
  if (adminNotes) complaint.adminNotes = adminNotes;

  if (status === "resolved") {
    complaint.resolvedBy = req.user._id;
    complaint.resolvedAt = new Date();
  }

  await complaint.save();

  res.json(
    new ApiResponse(
      200,
      { complaint },
      "Complaint status updated successfully",
    ),
  );
});

module.exports = {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  updateComplaintStatus,
};
