const asyncHandler = require("express-async-handler");
const Feedback = require("../models/Feedback.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Submit feedback
// @route   POST /api/v1/feedback
// @access  Private (Student)
const submitFeedback = asyncHandler(async (req, res) => {
  const { date, mealType, rating, comment } = req.body;

  if (!date || !mealType || !rating) {
    throw new ApiError(400, "Date, mealType, and rating are required");
  }

  const feedbackDate = new Date(date);
  feedbackDate.setHours(0, 0, 0, 0);

  // Check if feedback already exists
  let feedback = await Feedback.findOne({
    student: req.user._id,
    date: feedbackDate,
    mealType,
  });

  if (feedback) {
    feedback.rating = rating;
    feedback.comment = comment;
    await feedback.save();
  } else {
    feedback = await Feedback.create({
      student: req.user._id,
      date: feedbackDate,
      mealType,
      rating,
      comment,
    });
  }

  res
    .status(201)
    .json(
      new ApiResponse(201, { feedback }, "Feedback submitted successfully"),
    );
});

// @desc    Get feedback summary
// @route   GET /api/v1/feedback/summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
// @access  Private (Manager/Admin)
const getFeedbackSummary = asyncHandler(async (req, res) => {
  const { startDate, endDate, mealType } = req.query;

  let query = {};

  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if (mealType) {
    query.mealType = mealType;
  }

  const feedbacks = await Feedback.find(query).populate(
    "student",
    "name email rollNumber",
  );

  // Calculate summary
  const summary = {
    totalFeedbacks: feedbacks.length,
    averageRating:
      feedbacks.length > 0
        ? (
            feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
          ).toFixed(2)
        : 0,
    ratingDistribution: {
      1: feedbacks.filter((f) => f.rating === 1).length,
      2: feedbacks.filter((f) => f.rating === 2).length,
      3: feedbacks.filter((f) => f.rating === 3).length,
      4: feedbacks.filter((f) => f.rating === 4).length,
      5: feedbacks.filter((f) => f.rating === 5).length,
    },
    byMealType: {
      breakfast: {
        count: feedbacks.filter((f) => f.mealType === "breakfast").length,
        avgRating: 0,
      },
      lunch: {
        count: feedbacks.filter((f) => f.mealType === "lunch").length,
        avgRating: 0,
      },
      dinner: {
        count: feedbacks.filter((f) => f.mealType === "dinner").length,
        avgRating: 0,
      },
    },
  };

  // Calculate average rating by meal type
  ["breakfast", "lunch", "dinner"].forEach((meal) => {
    const mealFeedbacks = feedbacks.filter((f) => f.mealType === meal);
    if (mealFeedbacks.length > 0) {
      summary.byMealType[meal].avgRating = (
        mealFeedbacks.reduce((sum, f) => sum + f.rating, 0) /
        mealFeedbacks.length
      ).toFixed(2);
    }
  });

  res.json(new ApiResponse(200, { summary, feedbacks }));
});

// @desc    Get my feedback
// @route   GET /api/v1/feedback/me
// @access  Private (Student)
const getMyFeedback = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find({ student: req.user._id }).sort(
    "-date",
  );

  res.json(new ApiResponse(200, { feedbacks }));
});

module.exports = {
  submitFeedback,
  getFeedbackSummary,
  getMyFeedback,
};
