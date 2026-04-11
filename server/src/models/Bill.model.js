const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    totalMeals: {
      type: Number,
      default: 0,
      min: 0,
    },
    mealCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    fixedCost: {
      type: Number,
      default: 2000,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["DUE", "PAID"],
      default: "DUE",
    },
    paidAt: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "cash", "other"],
    },
    transactionId: {
      type: String,
    },
    breakdown: {
      breakfast: {
        count: { type: Number, default: 0 },
        rate: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      lunch: {
        count: { type: Number, default: 0 },
        rate: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      dinner: {
        count: { type: Number, default: 0 },
        rate: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to ensure one bill per student per month/year
billSchema.index({ student: 1, month: 1, year: 1 }, { unique: true });

// Index for efficient queries
billSchema.index({ student: 1, year: 1 });
billSchema.index({ status: 1 });
billSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Bill", billSchema);
