const mongoose = require("mongoose");

const mealSelectionSchema = new mongoose.Schema(
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
    meals: {
      breakfast: {
        type: Boolean,
        default: false,
      },
      lunch: {
        type: Boolean,
        default: false,
      },
      dinner: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one meal selection per student per day
mealSelectionSchema.index({ student: 1, date: 1 }, { unique: true });

// Index for efficient queries by date range
mealSelectionSchema.index({ student: 1, date: -1 });

// Index for admin queries
mealSelectionSchema.index({ date: 1 });

module.exports = mongoose.model("MealSelection", mealSelectionSchema);
