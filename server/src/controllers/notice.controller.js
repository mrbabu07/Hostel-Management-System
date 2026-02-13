const asyncHandler = require("express-async-handler");
const Notice = require("../models/Notice.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Create notice
// @route   POST /api/v1/notices
// @access  Private (Admin)
const createNotice = asyncHandler(async (req, res) => {
  const { title, content, category, isPinned, targetAudience, expiresAt } =
    req.body;

  const notice = await Notice.create({
    title,
    content,
    category: category || "general",
    isPinned: isPinned || false,
    targetAudience: targetAudience || "all",
    expiresAt,
    createdBy: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, { notice }, "Notice created successfully"));
});

// @desc    Get all notices
// @route   GET /api/v1/notices
// @access  Private
const getAllNotices = asyncHandler(async (req, res) => {
  const now = new Date();

  let query = {
    $or: [{ expiresAt: { $gt: now } }, { expiresAt: null }],
  };

  // Filter by target audience
  if (req.user.role === "student") {
    query.targetAudience = { $in: ["all", "students"] };
  } else if (req.user.role === "manager") {
    query.targetAudience = { $in: ["all", "managers"] };
  }

  const notices = await Notice.find(query)
    .populate("createdBy", "name email")
    .sort("-isPinned -createdAt");

  res.json(new ApiResponse(200, { notices }));
});

// @desc    Update notice
// @route   PUT /api/v1/notices/:id
// @access  Private (Admin)
const updateNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }

  const { title, content, category, isPinned, targetAudience, expiresAt } =
    req.body;

  notice.title = title || notice.title;
  notice.content = content || notice.content;
  notice.category = category || notice.category;
  notice.isPinned = isPinned !== undefined ? isPinned : notice.isPinned;
  notice.targetAudience = targetAudience || notice.targetAudience;
  notice.expiresAt = expiresAt || notice.expiresAt;

  await notice.save();

  res.json(new ApiResponse(200, { notice }, "Notice updated successfully"));
});

// @desc    Delete notice
// @route   DELETE /api/v1/notices/:id
// @access  Private (Admin)
const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }

  await notice.deleteOne();
  res.json(new ApiResponse(200, {}, "Notice deleted successfully"));
});

module.exports = {
  createNotice,
  getAllNotices,
  updateNotice,
  deleteNotice,
};
