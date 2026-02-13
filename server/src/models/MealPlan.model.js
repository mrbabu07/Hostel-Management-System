const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema(
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
  },
);

// Compound index to ensure one meal plan per student per day
mealPlanSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("MealPlan", mealPlanSchema);
