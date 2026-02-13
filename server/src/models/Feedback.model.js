const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient querying
feedbackSchema.index({ date: 1, mealType: 1 });
feedbackSchema.index({ student: 1, date: 1, mealType: 1 }, { unique: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
